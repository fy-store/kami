import Router from 'koa-router'
import { session } from '#lib'
import { formatDate } from 'assist-tools'

const router = new Router({ prefix: '/login' })
export default router

const account = 'root'
const password = '123456'

router.get('/', async (ctx) => {
	ctx.body = {
		code: 0,
		msg: '测试账号和密码获取成功',
		data: {
			account,
			password,
			session: ctx.session
		}
	}
})

router.post('/', async (ctx) => {
	if (ctx.request.body.account === account && ctx.request.body.password === password) {
		const token = await session.create({ identity: 'admin', createTime: formatDate(new Date()) })
		ctx.body = {
			code: 0,
			msg: '登录成功',
			data: {
				token
			}
		}
		return
	}

	ctx.body = {
		code: 1,
		msg: '账号或密码有误, 请用 GET 访问 /api/login 获取测试账号和密码'
	}
})
