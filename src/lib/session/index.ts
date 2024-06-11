import { Session } from '#systemLib'
import { session as sessionStore } from '#db'
import { TTimedTasksOptions } from './types/index.js'
import { formatDate } from 'assist-tools'

const session = new Session({
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

export default session

const timedTasks = (callback: Function, options: TTimedTasksOptions = {}) => {
	const config = {
		hour: 0,
		minute: 0,
		second: 0,
		millisecond: 0,
		...options
	}

	const now = new Date()
	const nowTime = now.getTime()
	const clear = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
		config.hour,
		config.minute,
		config.second,
		config.millisecond
	)

	let clearTime = clear.getTime()

	// 如果设定的时间点已经过了今天的时间点，设定为明天的时间点
	if (clearTime <= nowTime) {
		clear.setDate(clear.getDate() + 1)
		clearTime = clear.getTime()
	}

	setTimeout(() => {
		callback()
		timedTasks(callback, config)
	}, clearTime - nowTime)
}

timedTasks(
	() => {
		console.log('定时任务到点了', formatDate(new Date()))
	},
	{ hour: 18, minute: 14 }
)
