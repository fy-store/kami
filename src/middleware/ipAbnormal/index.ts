import { type Context, type Next } from 'koa'

/**
 * ip 异常校验中间件
 * - 校验生成会话的ip和使用会话的ip是否为同一个
 */
export default () => {
	return async (ctx: Context, next: Next) => {
		const { content } = ctx.container.userSession
		// 无用户会话, 白名单接口
		if (!content) {
			await next()
			return
		}

		// ip 相同
		if (ctx.ip === content.ip) {
			await next()
			return
		}

		ctx.body = {
			code: 403,
			msg: '设备环境异常'
		}
	}
}
