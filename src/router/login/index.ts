import Router from 'koa-router'
import { session, check } from '#lib'
import { hash } from '#systemLib'
import { admin } from '#db'
import { formatDate } from 'assist-tools'

const router = new Router({ prefix: '/login' })
export default router

router.get('/', async (ctx) => {
	const sessionList = []
	session.eatch(([id, content]) => {
		sessionList.push({ id, content })
	})
	ctx.body = {
		code: 0,
		msg: '测试账号和密码获取成功',
		data: {
			...config.project.root,
			session: ctx.session,
			sessionList
		}
	}
})

router.post('/', async (ctx) => {
	const err = {
		code: 1,
		msg: '账号或密码有误'
	}

	try {
		const body = ctx.request.body
		check
			.required(body, 'account')
			.required(body, 'password')
			.type(body, 'account', 'string')
			.type(body, 'password', 'string')
	} catch (error) {
		ctx.body = err
		return
	}

	const { account, password } = ctx.request.body
	const [[info]] = await admin.queryByAccount(account)
	if (!info) {
		ctx.body = err
		return
	}

	const result = await hash.verify(password, info.password)
	if (!result) {
		ctx.body = err
		return
	}

	const now = new Date()
	const token = await session.create({
		identity: 'admin',
		createTime: formatDate(now),
		lastActiveTime: formatDate(now)
	})

	ctx.body = {
		code: 0,
		msg: '登录成功',
		data: {
			token
		}
	}
})
