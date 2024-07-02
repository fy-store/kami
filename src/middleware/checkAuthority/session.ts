import { type TBasics, type TJSON } from '@system/lib/Session/types/index.js'
import { Session, timedTask } from '#systemLib'
import { session as sessionStore } from '#db'

export type TContent = {
	/** 用户id */
	id: number
	/** 用户身份 */
	identity: 'admin' | 'user'
	/** 创建时间 */
	createTime: string
	/** 最后活跃时间 */
	lastActiveTime: string
	/** 用户ip */
	ip: string
	/** 加密后的id */
	encrypt: string
	[key: string]: TBasics | TJSON
}

export const session = new Session<TContent>({
	async onCreate(id, content) {
		await sessionStore.create(id, content)
	},

	async onDelete(id) {
		await sessionStore.remove(id)
	},

	async onUpdate(ctx) {
		await sessionStore.update(ctx.id, ctx.newData)
	},

	async onSet(id, data) {
		await sessionStore.update(id, data)
	}
})

const sessionList = await sessionStore.get()
sessionList[0].forEach((sessionItem) => {
	session.load(sessionItem.id, sessionItem.content)
})

// 每晚两点定时清除已到期会话
timedTask(
	async () => {
		const nowTimer = new Date().getTime()
		const pArr = []
		session.eatch(([id, content]) => {
			if (new Date(content.lastActiveTime).getTime() + config.project.session.maxAge < nowTimer) {
				// 会话已过期
				pArr.push(session.delete(id))
			}
		})

		await Promise.all(pArr)
	},
	{ hour: 2 }
)
export default session
