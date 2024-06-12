import Router from 'koa-router'
import xss from 'xss'
import { hash } from '#systemLib'
import { admin } from '#db'
import { isString, formatDate } from 'assist-tools'

const router = new Router({ prefix: '/admin' })
export default router

router.post('/', async (ctx) => {
	let { account, password } = ctx.request.body
	if (!isString(account, password)) {
		ctx.body = {
			code: 1,
			msg: '参数错误'
		}
		return
	}

	account = xss(account).trim()
	password = await hash.encryp(xss(password).trim())

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
		msg: '账号创建成功'
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
