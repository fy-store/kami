import { type TInitedCtx } from '@system/types/lifeCycle.js'
import { cors } from '#systemMiddleware'
import koaStatic from 'koa-static'
import { bodyParser } from '@koa/bodyparser'
import router from '#router'
import { routeError } from '#lib'
import { extendCtx, checkAuthority, ipList, ipAbnormal, camouflagePHP } from '#middleware'
import path from 'path'

export default (ctx: TInitedCtx) => {
	const { app } = ctx
	app.on('error', routeError)
	app.use(extendCtx()) // 初始化扩展容器
	app.use(cors()) // 跨域配置
	app.use(ipList()) // ip 名单
	app.use(bodyParser()) // body 参数解析
	app.use(koaStatic(path.join(systemConfig.rootPath, config.project.webPath))) // 前端静态资源
	// app.use(camouflagePHP()) // php 接口伪装
	app.use(checkAuthority()) // 权限验证
	app.use(ipAbnormal()) // ip 异常校验
	app.use(router.routes()) // 使用路由
}
