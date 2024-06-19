import { TAllow } from '../types/type.js'
import Check from '../Check.js'
import required from './required.js'
import { isType, isStrNum } from 'assist-tools'

const allowType = {
	string(data: unknown) {
		return isType(data) === 'string'
	},
	number(data: unknown) {
		return isType(data) === 'number'
	},
	bigint(data: unknown) {
		return isType(data) === 'bigint'
	},
	boolean(data: unknown) {
		return isType(data) === 'boolean'
	},
	symbol(data: unknown) {
		return isType(data) === 'symbol'
	},
	undefined(data: unknown) {
		return isType(data) === 'undefined'
	},
	object(data: unknown) {
		return isType(data) === 'object'
	},
	function(data: unknown) {
		return isType(data) === 'function'
	},
	numberString(data: unknown) {
		return isStrNum(data)
	},
	null(data: unknown) {
		return isType(data) === 'null'
	},
	array(data: unknown) {
		return isType(data) === 'array'
	}
}

/**
 * 验证一个对象/数组上的指定键是否为指定的类型
 * - 验证排除原型
 * @param obj 验证的对象
 * @param key 验证的键
 * @param type 指定的类型
 * @returns 存在返回 实例对象, 否则将抛出错误
 */
export default function (obj: object, key: string | number | symbol, type: TAllow): Check {
	required(obj, key)
	if (!Object.hasOwn(allowType, type)) {
		throw new TypeError(`Unknown usage of "type", expected type ${Object.keys(type).join(', ')}`)
	}

	try {
		if (!allowType[type](obj[key])) {
			throw new Error(`Type error !`)
		}
	} catch (error) {
		throw new Error(`Type error !`)
	}

	return this
}
