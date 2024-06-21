import { nanoid } from 'nanoid'
import { isType, readOnly } from 'assist-tools'
import { set, type PropertyPath } from 'lodash-es'
import { TBasics, TConfig, TEatch, TJSON } from './types/index.js'

export default class Session<T extends TJSON> {
	#config: TConfig<T>
	#sessionStore = new Map<string, T>()

	get sessionStore() {
		return readOnly(this.#sessionStore, { mode: 'looseFitting', unReadOnly: true, sign: this.#config.sign })
	}

	/**
	 * 创建一个会话实例
	 * @param sign 实例唯一标识
	 */
	constructor(config: TConfig<T> = {}) {
		this.#config = config
		if (!Object.hasOwn(config, 'sign')) {
			this.#config.sign = Symbol()
		}
	}

	/**
	 * 创建一个当前实例唯一的会话id
	 */
	#createId() {
		let id = nanoid()
		while (1) {
			if (this.#sessionStore.has(id)) {
				id = nanoid()
			} else {
				return id
			}
		}
	}

	#cloneData<T>(content: T): T {
		const type = isType(content)
		if (!(type === 'array' || type === 'object')) {
			throw new TypeError(`"content" must be an array or object !`)
		}
		return JSON.parse(JSON.stringify(content))
	}

	/**
	 * 创建一个会话
	 * @param content 会话内容
	 * @returns 会话 ID
	 */
	async create(content: T = {} as T) {
		const newContent = this.#cloneData(content)
		const id = this.#createId()
		if (this.#config.onCreate) {
			await this.#config.onCreate.call(this, id, content)
		}
		this.#sessionStore.set(id, newContent)
		return id
	}

	#get(id: string): T | null {
		if (!this.#sessionStore.has(id)) {
			return null
		}

		return this.#sessionStore.get(id)
	}

	/**
	 * 获取指定会话
	 * @param id 会话 ID
	 * @returns 会话内容, 如果未找到该会话则返回 null
	 */
	get(id: string): T | null {
		const data = this.#get(id)
		return data ? readOnly(data, { mode: 'looseFitting', unReadOnly: true, sign: this.#config.sign }) : data
	}

	/**
	 * 更新会话内指定数据
	 * @param id 会话 ID
	 * @param prop 属性路径, 示例: a[0].b.c
	 * @param value 新的内容
	 * @returns 更新后的会话
	 */
	async update(id: string, prop: PropertyPath, value: TBasics | TJSON): Promise<T> {
		const type = isType(value)
		let content: TBasics | TJSON
		if (type === 'array' || type === 'object') {
			content = this.#cloneData(value)
		} else {
			const allow = ['number', 'string', 'boolean', 'null']
			if (!allow.includes(type)) {
				throw new TypeError(`"value" must be an array or object or number, string, boolean, null !`)
			}
			content = value
		}

		const originData = this.#get(id)
		if (!originData) {
			throw new Error(`sessionStore is not a session "${String(id)}" !`)
		}
		if (this.#config.onUpdate) {
			let newData: T
			const self = this
			await this.#config.onUpdate.call(this, {
				id,
				prop,
				value: content,
				originData,
				get newData() {
					if (!newData) {
						newData = set(self.#cloneData(originData), prop, content)
					}
					return newData
				}
			})
			this.#sessionStore.set(id, newData || set(self.#cloneData(originData), prop, content))
			return this.get(id)
		}

		set(originData, prop, content)
		return this.get(id)
	}

	/**
	 * 重新设置会话内容(替换整个会话)
	 * @param id 会话 ID
	 * @param data 新的数据
	 * @returns 新的会话
	 */
	async set(id: string, data: T) {
		const newData = this.#cloneData(data)
		if (this.#config.onSet) {
			await this.#config.onSet.call(this, id, newData)
		}
		this.#sessionStore.set(id, newData)
		return this.get(id)
	}

	/**
	 * 删除会话
	 * @param id 会话 ID
	 * @returns 布尔值, 是否删除成功
	 */
	async delete(id: string) {
		if (this.#config.onDelete) {
			await this.#config.onDelete.call(this, id)
		}
		return this.#sessionStore.delete(id)
	}

	/**
	 * 载入一个会话
	 * @param id 会话 ID
	 * @param content 会话内容
	 * @returns 会话 ID
	 */
	load(id: string, content: T) {
		if (this.get(id)) {
			throw new Error(`The ${id} is already exists !`)
		}

		const newContent = this.#cloneData(content)
		this.#sessionStore.set(id, newContent)
		return id
	}

	/**
	 * 迭代会话仓库
	 * @param callback 回调函数
	 */
	eatch(callback: TEatch<T>) {
		Array.from(this.#sessionStore).forEach((value, index) => {
			callback.call(
				this,
				readOnly(value, { mode: 'looseFitting', sign: this.#config.sign, unReadOnly: true }),
				index,
				readOnly(this.#sessionStore, { mode: 'looseFitting', sign: this.#config.sign, unReadOnly: true })
			)
		})
		return this
	}
}
