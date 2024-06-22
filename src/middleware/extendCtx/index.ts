import { type Context, type Next } from 'koa'

/**
 * 初始化上下文 container 容器中间件
 */
export default () => {
	return async (ctx: Context, next: Next) => {
		// @ts-ignore
		ctx.container = {} // 初始化容器
		await next()
	}
}
