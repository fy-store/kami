/**
 * 获取指定对象上的属性
 * @param target 目标对象
 * @param property 需要获取的属性数组
 * @param containPrototype 是否允许包含原型属性, 默认为 false
 * @returns 新的对象
 */
export default <T extends object, P extends keyof T>(
	target: T,
	property: P[],
	containPrototype?: boolean
): Pick<T, P> => {
	const newObj = {} as Pick<T, P>
	property.forEach((p) => {
		if (containPrototype) {
			newObj[p] = target[p]
			return
		}

		if (Object.hasOwn(target, p)) {
			newObj[p] = target[p]
		}
	})
	return newObj
}
