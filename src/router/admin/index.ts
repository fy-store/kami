import Router from 'koa-router'
import xss from 'xss'
import { hash } from '#systemLib'
import { admin } from '#db'
import { postCheck } from './check.js'
import { formatDate } from 'assist-tools'

const router = new Router({ prefix: '/admin' })
export default router

router.post('/', async (ctx) => {
	const body = ctx.request.body
	type State = { account: string; password: string }
	let state: State
	try {
		const result = postCheck.verify<State>(body)
		state = result.state
	} catch (error) {
		console.log(error)
		ctx.body = {
			code: 1,
			msg: '参数有误'
		}
		return
	}

	const account = xss(state.account)
	const password = await hash.encryp(xss(state.password))

	const [adminInfo] = await admin.queryByAccount(account)
	if (adminInfo.length) {
		ctx.body = {
			code: 1,
			msg: '账号已存在'
		}
		return
	}

	await admin.create(account, password)

	ctx.body = {
		code: 0,
		msg: '账号创建成功',
		data: {
			account
		}
	}
})

router.get('/', async (ctx) => {
	const [data] = await admin.queryList()
	for (const item of data) {
		item.createTime = formatDate(item.createTime)
	}

	ctx.body = {
		code: 0,
		msg: '管理员列表获取成功',
		data
	}
})
