import Check from '../index.js'
import { isType } from 'assist-tools'

/**
 * 验证一个对象/数组上的指定键是否为指定的类型
 * - 验证排除原型
 * - 验证规则为: >= min && <= max
 * @param obj 验证的对象
 * @param key 验证的键
 * @param min 最小长度
 * @param max 最大长度
 * @returns 存在返回 实例对象, 否则将抛出错误
 */
export default function (obj: object, key: string | number | symbol, min: number, max: number): typeof Check {
	if (!['string', 'array'].includes(isType(obj[key]))) {
		throw new TypeError(`The type is not within the allowed range, only allowed string and array !`)
	}

	if (obj[key].length >= min && obj[key].length <= max) {
		return this
	}

	throw new Error(`Length mismatch !`)
}
