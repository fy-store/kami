import { execute } from '#dbConnect'
import { db } from '#store'
import { repeatData } from '#lib'

const name = db.cardTable.name

type CreateParams = {
	token: string
	title: string
	desc: string
	content: string
	remark: string
}
/**
 * 创建一个卡密
 */
export const create = (params: CreateParams) => {
	const { token, title, desc, content, remark } = params
	const sql = `
    insert into ${name}(
        token, title, \`desc\`, content, remark, createTime
    ) values(?, ?, ?, ?, ?, from_unixtime(?))
    `
	return execute(sql, [token, title, desc, content, remark, Date.now() / 1000])
}

/**
 * 通过 token 查询信息
 */
export const queryInfoByToken = (token: string) => {
	const sql = `
	select id, token, createTime, title, \`desc\`, content, remark, useTime, state
	from ${name} where token = ? and deleteTime is null
	`
	return execute(sql, [token])
}

type QueryListParams = {
	page?: number
	limit?: number
	state?: string[]
}

/**
 * 获取列表
 */
export const queryList = (params: QueryListParams = {}) => {
	const { page = 1, limit = 10, state = [] } = params
	const q = []
	let sql = `
	select id, token, createTime, title, \`desc\`, content, remark, useTime, state
	from ${name} where 
	`
	if (state.length > 0) {
		sql += `
		state in(${repeatData('?', state.length, ', ')})
		and
		`
		q.push(...state)
	}

	sql += `
	deleteTime is null 
	order by id desc
	limit ?, ?
	`
	q.push(String((page - 1) * limit), String(limit))

	return execute(sql, q)
}

type QueryListCountParams = {
	state?: string[]
}

/**
 * 获取列表 count
 */
export const queryListCount = (params: QueryListCountParams = {}) => {
	const { state = [] } = params
	const q = []
	let sql = `
	select count(id) as count
	from ${name} where 
	`
	if (state.length > 0) {
		sql += `
		state in(${repeatData('?', state.length, ', ')})
		and
		`
		q.push(...state)
	}

	sql += `
	deleteTime is null
	`

	return execute(sql, q)
}

type UpdateStateParams = {
	id: number
	state: string
}

/**
 * 更新卡密 state
 */
export const updateState = (params: UpdateStateParams) => {
	const q = []
	let sql = `
	update ${name} set state = ?
	where id = ? and deleteTime is null
	`
	q.push(params.state, params.id)
	return execute(sql, q)
}
