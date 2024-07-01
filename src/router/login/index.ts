import Router from 'koa-router'
import { postCheck } from './check.js'
import { hash } from '#systemLib'
import { admin } from '#db'
import { formatDate } from 'assist-tools'

const router = new Router({ prefix: '/login' })
export default router

router.get('/', async (ctx) => {
	const sessionList = []
	ctx.container.userSession.session.eatch(([id, content]) => {
		sessionList.push({ id, content })
	})
	ctx.body = {
		code: 0,
		msg: '测试账号和密码获取成功',
		data: {
			ip: ctx.ip.startsWith('::ffff:') ? ctx.ip.replaceAll('::ffff:', '') : ctx.ip,
			...config.project.root,
			session: ctx.container.userSession.content,
			sessionList
		}
	}
})

router.post('/', async (ctx) => {
	const err = {
		code: 1,
		msg: '账号或密码有误'
	}

	type State = { account: string; password: string }
	let state: State
	try {
		const result = postCheck.verify<State>(ctx.request.body)
		state = result.state
	} catch (error) {
		ctx.body = err
		return
	}

	const { account, password } = state
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

	const { id: sessionId, session } = ctx.container.userSession
	const userSession = session.get(sessionId)
	let token: string
	const now = new Date()
	// 如果登录携带了 token 则直接返回 token
	if (userSession && userSession.id === info.id) {
		config.project.session.activeExtend && session.update(sessionId, 'lastActiveTime', formatDate(now)) // 续活token
		token = sessionId
	} else {
		const activeSession = []
		session.eatch(([, content]) => {
			if (
				content.id === info.id &&
				new Date(content.lastActiveTime).getTime() + config.project.session.maxAge > now.getTime()
			) {
				activeSession.push(content)
			}
		})

		if (activeSession.length >= config.project.session.accountActiveNum) {
			ctx.body = {
				code: 1,
				msg: `同个账号最多${config.project.session.accountActiveNum}个设备同时在线`
			}
			return
		}

		token = await session.create({
			id: info.id,
			ip: ctx.ip,
			identity: 'admin',
			createTime: formatDate(now),
			lastActiveTime: formatDate(now)
		})
	}

	ctx.body = {
		code: 0,
		msg: '登录成功',
		data: {
			token
		}
	}
})
