import Check from '../Check.js'
/**
 * 验证一个对象/数组上的指定键是否存在
 * - 验证排除原型
 * @param obj 验证的对象
 * @param key 验证的键
 * @returns 存在返回 实例对象, 否则将抛出错误
 */
export default function (obj: object, key: string | number | symbol): Check {
	const result = Object.hasOwn(obj, key)
	if (!result) {
		throw new Error(`The key ${String(key)} does not exist on obj`)
	}
	return this
}
