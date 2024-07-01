import Router from 'koa-router'

const router = new Router({ prefix: '/logout' })
export default router

router.post('/', async (ctx) => {
	const { id, content, session } = ctx.container.userSession
	if (content) {
		await session.delete(id)
	}
	ctx.body = {
		code: 0,
		msg: '已退出'
	}
})
