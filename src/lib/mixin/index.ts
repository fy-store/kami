/**
 * @param target 目标对象
 * @param args 混入的对象数据
 * @returns 目标对象
 */
export default <T1 extends object, T2 extends object[]>(target: T1, ...args: T2): T1 & T2[number] => {
	args.forEach((item) => {
		Object.keys(item).forEach((field) => {
			if (!Object.hasOwn(target, field)) {
				target[field] = item[field]
				return
			}
			if (target[field] !== void 0) return
			target[field] = item[field]
		})
	})
	return target
}
