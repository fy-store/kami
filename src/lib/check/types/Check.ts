import { TAllow } from './type.js'

export type THook<TState, TData> = (ctx: {
	/** 校验的字段 */
	fixed: string
	/** 状态空间 */
	state: TState
	/** 校验的数据 */
	data: TData
	/** 错误对象 */
	error: null | Error
	/** 错误消息配置信息 */
	errorMsg: any[]
}) => void | Promise<void>

export type TConfig<TState, TData> = {
	/** 校验的字段 */
	fixed: string
	/** 字段是否必填, 默认为 true */
	required?:
		| boolean
		| {
				/** 字段是否必填 */
				expect: boolean
				/** 若启用该项配置, 当规则产生错误时 errorMsg 将被写入上下文的 errorMsg 数组中 */
				errorMsg?: any
				/** 钩子函数, 在该规则验证前触发 */
				onBefore?: THook<TState, TData>
				/** 钩子函数, 在该规则验证通过时触发 */
				onSuccess?: THook<TState, TData>
				/** 钩子函数, 在该规则验证失败时触发 */
				onError?: THook<TState, TData>
				/** 钩子函数, 在该规则验证之后触发, 若出现 "规则错误" 未捕获, 则该钩子不会触发 */
				onAfter?: THook<TState, TData>
		  }
	/**
	 * 字段类型, 默认为 * 允许任何类型
	 * - **string** 字符串
	 * - **number** 数字类型
	 * - **bigint** bigint(大整数) 类型
	 * - **boolean** boolean 类型
	 * - **symbol** symbol 类型
	 * - **undefined** undefind 类型
	 * - **object** 对象类型
	 * - **function** 函数类型
	 * - **numberString** 数字或数字字符串(别名 stringNumber)
	 * - **stringNumber** 数字或数字字符串(numberString 别名)
	 * - **positiveIntNumber** 大于 0 的整数
	 * - **intNumber** 整数, 包括 0, 正整数, 负整数
	 * - **effectiveNumber** 有效的数字, 排除 NaN, Infinity, -Infinity
	 * - **null** null 类型
	 * - **array** 数组类型
	 * - **\*** 任何类型
	 */
	type?:
		| TAllow
		| TAllow[]
		| {
				/**
				 * 字段类型, 默认为 * 允许任何类型
				 * - **string** 字符串
				 * - **number** 数字类型
				 * - **bigint** bigint(大整数) 类型
				 * - **boolean** boolean 类型
				 * - **symbol** symbol 类型
				 * - **undefined** undefind 类型
				 * - **object** 对象类型
				 * - **function** 函数类型
				 * - **numberString** 数字或数字字符串(别名 stringNumber)
				 * - **stringNumber** 数字或数字字符串(numberString 别名)
				 * - **positiveIntNumber** 大于 0 的整数
				 * - **intNumber** 整数, 包括 0, 正整数, 负整数
				 * - **effectiveNumber** 有效的数字, 排除 NaN, Infinity, -Infinity
				 * - **null** null 类型
				 * - **array** 数组类型
				 * - **\*** 任何类型
				 */
				expect: TAllow | TAllow[]
				/** 若启用该项配置, 当规则产生错误时 errorMsg 将被写入上下文的 errorMsg 数组中 */
				errorMsg?: any
				/** 钩子函数, 在该规则验证前触发 */
				onBefore?: THook<TState, TData>
				/** 钩子函数, 在该规则验证通过时触发 */
				onSuccess?: THook<TState, TData>
				/** 钩子函数, 在该规则验证失败时触发 */
				onError?: THook<TState, TData>
				/** 钩子函数, 在该规则验证之后触发, 若出现 "规则错误" 未捕获, 则该钩子不会触发 */
				onAfter?: THook<TState, TData>
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
		/** 若启用该项配置, 当规则产生错误时 errorMsg 将被写入上下文的 errorMsg 数组中 */
		errorMsg?: any
		/** 钩子函数, 在该规则验证前触发 */
		onBefore?: THook<TState, TData>
		/** 钩子函数, 在该规则验证通过时触发 */
		onSuccess?: THook<TState, TData>
		/** 钩子函数, 在该规则验证失败时触发 */
		onError?: THook<TState, TData>
		/** 钩子函数, 在该规则验证之后触发, 若出现 "规则错误" 未捕获, 则该钩子不会触发 */
		onAfter?: THook<TState, TData>
	}
}

/**
 * 配置选项
 */
export type TOptions<TState, TData> = {
	/**
	 * 钩子函数, 在验证器执行前触发
	 * - 该钩子函数通常用于数据初始化
	 */
	onBefore?: THook<TState, TData>
	/**
	 * 钩子函数, 在验证器执行完后触发, 若出现 "规则错误" 未捕获, 则该钩子不会触发
	 * - 该钩子函数通常用于数据归档
	 */
	onAfter?: THook<TState, TData>
}

export type TParseConfig<TState, TData> = {
	fixed: string
	required: {
		expect: boolean
		errorMsg?: any
		onBefore?: THook<TState, TData>
		onSuccess?: THook<TState, TData>
		onError?: THook<TState, TData>
		onAfter?: THook<TState, TData>
	}
	type: {
		expect: TAllow | TAllow[]
		errorMsg?: any
		onBefore?: THook<TState, TData>
		onSuccess?: THook<TState, TData>
		onError?: THook<TState, TData>
		onAfter?: THook<TState, TData>
	}
	length: {
		expect: {
			min: number
			max: number
		}
		errorMsg?: any
		onBefore?: THook<TState, TData>
		onSuccess?: THook<TState, TData>
		onError?: THook<TState, TData>
		onAfter?: THook<TState, TData>
	}
}

/** 移除类型中的指定类型 */
export type RemoveType<T, U> = T extends U ? never : T

// 提取 config 中的 fixed 字段
// export type GetFixed<T> = T extends { fixed: infer F }[] ? F : never
// export type GetFixed<T extends { fixed: string }[]> = T[number]['fixed']
