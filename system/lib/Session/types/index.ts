import { type PropertyPath } from 'lodash-es'
import Session from '../index.js'

/**
 * 基本数据类型
 */
export type TBasics = string | number | boolean | null

/**
 * 数组类型
 */
export type TArr = (TBasics | TObj | TArr)[]
/**
 * 对象类型
 */
export type TObj = {
	[key: string | number]: TBasics | TArr | TObj
}

/**
 * JSON类型
 */
export type TJSON = TArr | TObj

/**
 * 迭代回调函数
 */
export type TEatch<T extends TJSON> = (
	this: Session<T>,
	value: [string, T],
	index: number,
	sessionStore: Map<string, T>
) => void

/**
 * 配置对象
 */
export interface TConfig<T extends TJSON> {
	/**
	 * 当前实例唯一标识
	 */
	sign?: any
	/**
	 * 当创建会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param content 会话内容
	 */
	onCreate?: (this: this, id: string, content: T) => void | Promise<void>
	/**
	 * 当更新会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param ctx 上下文对象
	 */
	onUpdate?: (
		this: Session<T>,
		ctx: {
			/**
			 * 会话 ID
			 */
			id: string
			/**
			 * 操作数据的路径
			 */
			prop: PropertyPath
			/**
			 * 传递的值
			 */
			value: TJSON | number | string | boolean | null
			/**
			 * 旧的值
			 */
			originData: T
			/**
			 * 新的值
			 */
			newData: T
		}
	) => void | Promise<void>
	/**
	 * 当重新设置会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param data 会话数据
	 */
	onSet?: (this: Session<T>, id: string, data: T) => void | Promise<void>
	/**
	 * 当删除会话时触发
	 * - 如果返回一个 Promise 则等待该 Promise 完成
	 * - 触发时机在写入内存会话仓库之前, 如果产生错误, 内存中的会话将不会执行操作
	 * @param id 会话 ID
	 * @param data 会话数据
	 */
	onDelete?: (this: Session<T>, id: string) => void | Promise<void>
}
