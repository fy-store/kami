import { Session, timedTask } from '#systemLib'
import { session as sessionStore } from '#db'
import { formatDate, readOnly } from 'assist-tools'

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

session.eatch(([id, content]) => {
	console.log(id, content)
})

timedTask(() => {}, { hour: 2 })

export default session
