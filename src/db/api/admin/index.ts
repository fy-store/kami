import { execute } from '#dbConnect'
import { db } from '#store'

const name = db.adminTable.name
export const create = (account: string, password: string) => {
	const sql = `
    insert into ${name}(
        account,
        password,
        createTime
    ) values(?, ?, from_unixtime(?))
    `
	return execute(sql, [account, password, Date.now() / 1000])
}

export const removeById = (id: number) => {
	const sql = `
    update ${name} set deleteTime = from_unixtime(?) where id = ? and deleteTime is null
    `
	return execute(sql, [Date.now() / 1000, id])
}

export const updatePassword = (id: number, password: string) => {
	const sql = `
    update ${name} set password = ? where id = ? and deleteTime is null
    `
	return execute(sql, [password, id])
}

export const queryList = () => {
	const sql = `
    select id, account, createTime from ${name} where deleteTime is null
    `
	return execute(sql)
}

export const queryByAccount = (account: string) => {
	const sql = `
    select id, account, password, createTime from ${name} where account = ? and deleteTime is null
    `
	return execute(sql, [account])
}
