import xss from 'xss'
import { Check, defaultData, mapData, getProperty } from '#lib'
import { card } from '#store'

export type PostState = {
	title: string
	desc: string
	content: string
	remark: string
}

export type PostData = Partial<PostState>

/** 创建校验 */
export const postCheck = new Check<PostState, PostData>(
	[
		{
			fixed: 'title',
			type: 'string',
			length: {
				expect: {
					min: 0,
					max: 200
				}
			}
		},
		{
			fixed: 'desc',
			type: 'string',
			length: {
				expect: {
					min: 0,
					max: 200
				}
			}
		},
		{
			fixed: 'content',
			type: 'string',
			length: {
				expect: {
					min: 0,
					max: 2000
				}
			}
		},
		{
			fixed: 'remark',
			type: 'string',
			length: {
				expect: {
					min: 0,
					max: 2000
				}
			}
		}
	],
	{
		onBefore(ctx) {
			Object.assign(ctx.data, {
				title: '',
				desc: '',
				content: '',
				remark: '',
				...ctx.data
			})
		},
		onAfter(ctx) {
			Object.assign(ctx.state, {
				title: xss(ctx.data.title),
				desc: xss(ctx.data.desc),
				content: xss(ctx.data.content),
				remark: xss(ctx.data.remark)
			})
		}
	}
)

export type GetListState = {
	page: number
	limit: number
	state: string[]
}

export type GetListData = Partial<GetListState>

/** 获取列表校验 */
export const getListCheck = new Check<GetListState, GetListData>(
	[
		{
			fixed: 'page',
			type: {
				expect: 'positiveIntNumber',
				errorMsg: 'page 参数不是一个正整数'
			}
		},
		{
			fixed: 'limit',
			type: {
				expect: 'positiveIntNumber',
				errorMsg: 'limit 参数不是一个正整数'
			}
		},
		{
			fixed: 'state',
			type: {
				expect: 'array',
				onBefore(ctx) {
					const state = Object.values(card.state)
					const result = ctx.data.state.every((item) => state.includes(item))
					if (!result) {
						throw ctx
					}
				},
				errorMsg: 'state 参数有误'
			}
		}
	],
	{
		onBefore(ctx) {
			defaultData(ctx.data, {
				page: 1,
				limit: 10,
				state: '[]'
			})

			mapData(
				ctx.data,
				{
					page(value) {
						return +value
					},
					limit(value) {
						return +value
					},
					state(value) {
						try {
							return JSON.parse(value as unknown as string)
						} catch (error) {
							ctx.errorMsg.push(`state 不符合 JSON 格式, ${String(value)}`)
							throw ctx
						}
					}
				},
				true
			)
		},
		onAfter(ctx) {
			const state = getProperty(ctx.data, ['page', 'limit', 'state'])
			Object.assign(ctx.state, state)
		}
	}
)

export type useCheckState = {
	token: string
}

/** 使用卡密校验 */
export const useCheck = new Check<useCheckState>(
	[
		{
			fixed: 'token',
			required: {
				expect: true,
				errorMsg: 'token 不存在'
			},
			type: {
				expect: 'string',
				errorMsg: 'token 类型有误'
			}
		}
	],
	{
		onAfter(ctx) {
			Object.assign(ctx.state, getProperty(ctx.data, ['token']))
		}
	}
)
