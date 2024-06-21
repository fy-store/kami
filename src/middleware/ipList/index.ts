import { type Context, type Next } from 'koa'
import { Session, timedTask } from '#systemLib'
import { ipList as sessionStore } from '#db'
import { cloneDeep } from 'assist-tools'

export type TSessionContent = {
	createTime: number
	blacklist: boolean
	access: { endTime: number }[]
}
export const session = new Session<TSessionContent>()

const sessionList = await sessionStore.get()
sessionList[0].forEach((sessionItem) => {
	session.load(sessionItem.id, sessionItem.content)
})

export default () => {
	return async (ctx: Context, next: Next) => {
		let ipSession = session.get(ctx.ip)
		if (!ipSession) {
			const now = Date.now()
			// 首次访问
			const data = {
				createTime: now,
				blacklist: false,
				access: []
			}
			await sessionStore.create(ctx.ip, data) // 写入数据库
			session.load(ctx.ip, data)
			ipSession = session.get(ctx.ip)
		}

		// 验证ip是否在黑名单
		if (ipSession.blacklist) {
			ctx.req.destroy()
			return
		}

		// 移除到期访问记录
		const now = Date.now()
		let access = ipSession.access.filter((item) => {
			return item.endTime >= now
		})

		access = access.concat([
			{
				endTime: now + config.project.ipList.maxAge
			}
		])

		session.update(ctx.ip, 'access', access)

		// 验证是否达到拉黑标准, 达到即断开连接并拉黑
		if (ipSession.access.length >= config.project.ipList.deathCount) {
			ctx.req.destroy()
			session.update(ctx.ip, 'blacklist', true)
			session.update(ctx.ip, 'access', [])
			sessionStore.update(ctx.ip, cloneDeep(ipSession)) // 更新数据库, 异步执行不等待
			return
		}

		// 验证是否频繁访问
		if (ipSession.access.length >= config.project.ipList.maxCount) {
			ctx.status = 403
			ctx.body = {
				code: 403,
				msg: '访问过于频繁, 请稍后再试'
			}
			return
		}

		ctx.container.ipSession = {
			id: ctx.ip,
			content: ipSession,
			session
		}
		await next()
	}
}

// 定时任务
timedTask(
	() => {
		session.eatch(([id, content]) => {
			const now = Date.now()
			const newAccess = content.access.filter((item) => item.endTime >= now)
			session.update(id, 'access', newAccess)
		})
	},
	{ hour: 2 }
)
