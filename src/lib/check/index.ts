import required from './core/required.js'
import typeFun from './core/type.js'
import length from './core/length.js'
import { RemoveType, TConfig, TOptions, TParseConfig } from './types/Check.js'
import { isType } from 'assist-tools'
import { allowType } from './core/type.js'

const runIf = {
	required(item, data) {
		if (item.required.expect) {
			required(data, item.fixed)
		}
	},
	type(item, data) {
		if (item.type.expect === '*') {
			return
		}
		typeFun(data, item.fixed, item.type.expect)
	},
	length(item, data) {
		if (item.length.expect) {
			length(data, item.fixed, item.length.expect.min, item.length.expect.max)
		}
	}
} as {
	[k in RemoveType<keyof TParseConfig, 'fixed'>]: (
		item: TParseConfig,
		data: object,
		rule: RemoveType<keyof TParseConfig, 'fixed'>
	) => void
}

/**
 * 校验器
 */
export default class Check {
	static required = required
	static type = typeFun
	static length = length
	#config: TParseConfig[]
	#runSort: RemoveType<keyof TParseConfig, 'fixed'>[] = ['required', 'type', 'length']
	#options: TOptions = {}
	get options() {
		return this.#options
	}

	/**
	 * 校验器
	 * @param config 规则数组
	 * @param options 配置选项
	 */
	constructor(config: TConfig[], options: TOptions = {}) {
		if (isType(config) !== 'array') {
			throw new TypeError('"config" must be an array !')
		}

		const newConfig: TParseConfig[] = []
		for (const item of config) {
			if (isType(item) !== 'object') {
				throw new TypeError(`Each "item" in "config" must be an object !`)
			}

			const { fixed, required = true, type, length } = item

			if (isType(fixed) !== 'string') {
				throw new TypeError(`Each "item.fixed" in "config" must be a string !`)
			}

			newConfig.push({
				fixed,
				required: this.#initRequired(required, item),
				type: this.#initType(type, item),
				length: this.#initLength(length, item)
			})
		}

		this.#config = newConfig as TParseConfig[]

		if (isType(options) !== 'object') {
			throw new TypeError('"options" must be an object !')
		}
		this.#options = options
	}

	#initRequired(required: any, _config: TConfig): TParseConfig['required'] {
		if (isType(required) !== 'object') {
			return {
				expect: !!required
			}
		}

		return required
	}

	#initType(type: any, config: TConfig): TParseConfig['type'] {
		if (isType(type) !== 'object') {
			if (type === '*') {
				return {
					expect: '*'
				}
			}

			if (!Object.hasOwn(config, 'type')) {
				type = '*'
			}

			if (!Object.hasOwn(allowType, type)) {
				throw new TypeError(`Each "item.type" in "config" must be a ${Object.keys(allowType).join(', ')} !`)
			}

			return {
				expect: type
			}
		}

		return type
	}

	#initLength(length: any, _config: TConfig): TParseConfig['length'] {
		if (length === void 0) {
			return {
				expect: void 0
			}
		}

		if (isType(length) !== 'object') {
			throw new TypeError(`Each "item.length" in "config" must be a "object" !`)
		}
		return length
	}

	/**
	 * 验证数据是否合法
	 * - 该方法是异步的, 如果你想同步执行请使用 verify()
	 * - 如果钩子函数返回的是一个Promise, 则执行器会等待其完成
	 * @param data 一个对象
	 * @returns 返回一个 Promise
	 */
	async verifyAsync<State = object, Data = object>(data: Data) {
		if (isType(data) !== 'object') {
			throw new TypeError('"data" must be an object !')
		}

		const state = {} as State
		this.#options.onBefore &&
			(await this.#options.onBefore({
				data,
				state,
				fixed: null,
				error: null
			}))

		for (const item of this.#config) {
			const ctx = {
				fixed: item.fixed,
				state,
				data,
				error: null
			}

			for (const rule of this.#runSort) {
				const config = item[rule]
				try {
					config.onBefore && (await config.onBefore(ctx))
					runIf[rule](item, data as object, rule)
					config.onSuccess && (await config.onSuccess(ctx))
				} catch (error) {
					ctx.error = error
					if (config.onError) {
						await config.onError(ctx)
					} else {
						throw ctx
					}
				}
				config.onAfter && (await config.onAfter(ctx))
			}
		}

		this.#options.onAfter &&
			(await this.#options.onAfter({
				data,
				state,
				fixed: null,
				error: null
			}))

		return {
			state,
			data,
			fixed: null,
			error: null
		}
	}

	/**
	 * 验证数据是否合法
	 * - 该方法是同步的, 如果你想异步执行请使用 verifyAsync()
	 * @param data 一个对象
	 * @returns 有误则抛出错误
	 */
	verify<State = object, Data = object>(data: Data) {
		if (isType(data) !== 'object') {
			throw new TypeError('"data" must be an object !')
		}

		const state = {} as State
		this.#options.onBefore &&
			this.#options.onBefore({
				data,
				state,
				fixed: null,
				error: null
			})

		for (const item of this.#config) {
			const ctx = {
				fixed: item.fixed,
				state,
				data,
				error: null
			}

			for (const rule of this.#runSort) {
				const config = item[rule]
				try {
					config.onBefore && config.onBefore(ctx)
					runIf[rule](item, data as object, rule)
					config.onSuccess && config.onSuccess(ctx)
				} catch (error) {
					ctx.error = error
					if (config.onError) {
						config.onError(ctx)
					} else {
						throw ctx
					}
				}
				config.onAfter && config.onAfter(ctx)
			}
		}

		this.#options.onAfter &&
			this.#options.onAfter({
				data,
				state,
				fixed: null,
				error: null
			})

		return {
			state,
			data,
			fixed: null,
			error: null
		}
	}
}
