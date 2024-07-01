import { Check } from '#lib'

/** 创建校验 */
export const postCheck = new Check(
	[
		{
			fixed: 'account',
			type: 'string',
			length: {
				expect: {
					min: 3,
					max: 8
				}
			}
		},
		{
			fixed: 'password',
			type: 'string',
			length: {
				expect: {
					min: 5,
					max: 16
				}
			}
		}
	],
	{
		onBefore(ctx) {
			ctx.data.account = String(ctx.data.account).trim()
			ctx.data.password = String(ctx.data.password).trim()
		},
		onAfter(ctx) {
			ctx.state.account = ctx.data.account
			ctx.state.password = ctx.data.password
		}
	}
)
