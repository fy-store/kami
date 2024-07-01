import { TAllow } from './type.js'

export type THook<T> = (ctx: {
	/** 校验的字段 */
	fixed: T
	/** 状态空间 */
	state: Record<string | number | symbol, any>
	/** 校验的数据 */
	data: any
	/** 错误对象 */
	error: null | Error
}) => void | Promise<void>

export type TConfig<T = string> = {
	/** 校验的字段 */
	fixed: T
	/** 字段是否必填, 默认为 true */
	required?:
		| boolean
		| {
				/** 字段是否必填 */
				expect: boolean
				/** 钩子函数, 在该规则验证前触发 */
				onBefore?: THook<T>
				/** 钩子函数, 在该规则验证通过时触发 */
				onSuccess?: THook<T>
				/** 钩子函数, 在该规则验证失败时触发 */
				onError?: THook<T>
				/** 钩子函数, 在该规则验证之后触发 */
				onAfter?: THook<T>
		  }
	/** 字段类型, 默认为 * 允许任何类型 */
	type?:
		| TAllow
		| TAllow[]
		| {
				/** 字段类型, 默认为 * 允许任何类型 */
				expect: TAllow | TAllow[]
				/** 钩子函数, 在该规则验证前触发 */
				onBefore?: THook<T>
				/** 钩子函数, 在该规则验证通过时触发 */
				onSuccess?: THook<T>
				/** 钩子函数, 在该规则验证失败时触发 */
				onError?: THook<T>
				/** 钩子函数, 在该规则验证之后触发 */
				onAfter?: THook<T>
		  }
	/** 字段长度, 验证 length 属性, 不配置则不校验 */
	length?: {
		/** 字段长度, 验证 length 属性 */
		expect: {
			/** 最小长度(包括最小长) */
			min: number
			/** 最大长度(包括最大长) */
			max: number
		}
		/** 钩子函数, 在该规则验证前触发 */
		onBefore?: THook<T>
		/** 钩子函数, 在该规则验证通过时触发 */
		onSuccess?: THook<T>
		/** 钩子函数, 在该规则验证失败时触发 */
		onError?: THook<T>
		/** 钩子函数, 在该规则验证之后触发 */
		onAfter?: THook<T>
	}
}

/**
 * 配置选项
 */
export type TOptions = {
	/** 
	 * 钩子函数, 在验证器执行前触发
	 * - 该钩子函数通常用于数据初始化
	 */
	onBefore?: THook<string>
	/**
	 * 钩子函数, 在验证器执行完后触发, 若出现 "规则错误" 未捕获, 则该钩子不会触发
	 * - 该钩子函数通常用于数据归档
	 */
	onAfter?: THook<string>
}

export type TParseConfig<T = string> = {
	fixed: T
	required: {
		expect: boolean
		onBefore?: THook<T>
		onSuccess?: THook<T>
		onError?: THook<T>
		onAfter?: THook<T>
	}
	type: {
		expect: TAllow | TAllow[]
		onBefore?: THook<T>
		onSuccess?: THook<T>
		onError?: THook<T>
		onAfter?: THook<T>
	}
	length: {
		expect: {
			min: number
			max: number
		}
		onBefore?: THook<T>
		onSuccess?: THook<T>
		onError?: THook<T>
		onAfter?: THook<T>
	}
}

/** 移除类型中的指定类型 */
export type RemoveType<T, U> = T extends U ? never : T
