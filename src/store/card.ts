import { readOnly } from 'assist-tools'

export default readOnly({
	state: {
		/** 禁用 */
		disabled: 0,
		/** 未使用 */
		notUse: 1,
		/** 已使用 */
		use: 2
	}
})
