import { type Context, type Next } from 'koa'

export default () => {
	return async (ctx: Context, next: Next) => {
		// @ts-ignore
		ctx.container = {} // 初始化容器
		await next()
	}
}
