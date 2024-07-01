import { Check } from '#lib'

/** 登录校验 */
export const postCheck = new Check(
	[
		{
			fixed: 'account',
			type: 'string'
		},
		{
			fixed: 'password',
			type: 'string'
		}
	],
	{
		onAfter(ctx) {
			ctx.state.account = ctx.data.account.trim()
			ctx.state.password = ctx.data.password.trim()
		}
	}
)
