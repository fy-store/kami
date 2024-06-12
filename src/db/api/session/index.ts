// 该模块用于 session 持久化存储

import { execute } from '#dbConnect'
import { TJSON } from '@system/lib/Session/types/index.js'
import { db } from '#store'

const name = db.sessionTable.name
export const create = (id: string, content: TJSON) => {
	const sql = `
        insert into ${name}(
            id, 
            content
        ) 
        values(?, ?)
    `
	return execute(sql, [id, content])
}

export const remove = (sessionId: string) => {
	const sql = `
       update ${name} set deleteTime = from_unixtime(?) where id = ? and deleteTime is null
    `
	return execute(sql, [Date.now() / 1000, sessionId])
}

export const update = (sessionId: string, sessionContent: TJSON) => {
	const sql = `
       update ${name} set content = ? where id = ? and deleteTime is null
    `
	return execute(sql, [sessionContent, sessionId])
}

export const get = () => {
	const sql = `
        select id, content from ${name} where deleteTime is null
    `
	return execute(sql)
}
