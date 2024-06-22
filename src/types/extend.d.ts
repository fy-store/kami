/**
 * - 该模块用于扩展 koa 和 koa-router 类型
 */

import { type TSessionContent as TIpSessionContent, type session as ipSession } from '@/middleware/ipList/index.ts'
import { type TContent as TUserSessionContent, type session as userSession } from '@/middleware/checkAuthority/session.ts'

export interface Container {
	/**
	 * ip会话
	 */
	ipSession: {
		/**
		 * 会话ID
		 */
		id: string
		/**
		 * 会话内容
		 */
		content: TIpSessionContent
		/**
		 * 会话对象
		 */
		session: typeof ipSession
	}

	/**
	 * 用户会话
	 */
	userSession: {
		/**
		 * 会话ID(白名单内的接口不保证有值或有效)
		 */
		id: string
		/**
		 * 会话内容(白名单内的接口不保证有值)
		 */
		content: TUserSessionContent
		/**
		 * 会话对象
		 */
		session: typeof userSession
	}
}

declare module 'koa' {
	interface Context {
		/**
		 * 扩展容器
		 */
		container: Container
	}
}

declare module 'koa-router' {
	interface IRouterParamContext {
		/**
		 * 扩展容器
		 */
		container: Container
	}
}
