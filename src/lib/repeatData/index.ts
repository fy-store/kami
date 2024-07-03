import { cloneDeep } from 'lodash-es'

/**
 * 生成重复数据
 * @param length 生成数据的长度
 * @param item 每项数据的内容(将进行深拷贝)
 * @param transformStr 组合成字符串, 如果传递该参数则按照传递的 transformStr 组合成字符串 [可选]
 * @returns 未传递 transformStr 将返回数组, 若传递了 transformStr 则返回组合后的字符串
 */
export default <T>(length: number, item: T, transformStr?: string): T[] | string => {
	const result = []
	for (let i = 0; i < length; i++) {
		result.push(cloneDeep(item))
	}

	return typeof transformStr === 'string' ? result.join(transformStr) : result
}
