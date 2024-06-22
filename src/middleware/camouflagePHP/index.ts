import {} from 'url'
import { type Context, type Next } from 'koa'

/**
 * PHP伪装中间件
 * - 将指定接口伪装成PHP
 * @param url 以什么开头的 url 要被伪装, 默认为 '' , 即所有 url
 */
export default (url = '') => {
	return async (ctx: Context, next: Next) => {
		// 不以 url 开头的接口忽略
		if (!ctx.url.startsWith(url)) {
			await next()
			return
		}

		const urlInfo = ctx.URL
		// 以 .php 结尾的接口, 重写 url
		if (urlInfo.pathname.endsWith('.php')) {
			ctx.url = urlInfo.pathname.replaceAll('.php', '') + urlInfo.search
			await next()
			return
		}

		ctx.status = 404
		ctx.body = {
			code: 404,
			msg: '您访问的地址不存在'
		}
	}
}
