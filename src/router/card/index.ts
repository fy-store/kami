import Router from 'koa-router'
import { postCheck, type PostState, getListCheck, type GetListState, useCheck, type useCheckState } from './check.js'
import { nanoid } from 'nanoid'
import { card } from '#db'
import { card as cardConfig } from '#store'

const router = new Router({ prefix: '/card' })
export default router

router.post('/', async (ctx) => {
	let state: PostState
	try {
		state = postCheck.verify(ctx.request.body).state
	} catch (error) {
		ctx.body = {
			code: 1,
			msg: '参数有误'
		}
		return
	}

	let token: string
	while (1) {
		token = nanoid(36)
		const [infoList] = await card.queryInfoByToken(token)
		if (infoList.length === 0) {
			break
		}
	}

	await card.create({ ...state, token })

	ctx.body = {
		code: 0,
		msg: '创建成功',
		data: {
			token
		}
	}
})

router.patch('/', async (ctx) => {
	let state: useCheckState
	try {
		state = useCheck.verify(ctx.request.body).state
	} catch (error) {
		ctx.body = {
			code: 1,
			msg: error.errorMsg?.join(', ') || '参数有误'
		}
		return
	}

	const [[info]] = await card.queryInfoByToken(state.token)
	if (!info) {
		ctx.body = {
			code: 1,
			msg: '卡密不存在'
		}
		return
	}

	// 验证是否为未使用
	if (info.state !== cardConfig.state.notUse) {
		ctx.body = {
			code: 1,
			msg: '卡密无效'
		}
		return
	}

	const result = await card.updateState({ id: info.id, state: cardConfig.state.use })
	console.log(result)
	info.state = cardConfig.state.use

	ctx.body = {
		code: 0,
		msg: '兑换成功',
		data: info
	}
})

router.get('/', async (ctx) => {
	let state: GetListState
	try {
		state = getListCheck.verify(ctx.query).state
	} catch (error) {
		ctx.body = {
			code: 1,
			msg: error.errorMsg?.join(', ') || '参数有误'
		}
		return
	}

	const [data] = await card.queryList(state)
	const [[{ count }]] = await card.queryListCount(state)
	ctx.body = {
		code: 0,
		msg: '卡密列表获取成功',
		data: {
			count,
			data
		}
	}
})
