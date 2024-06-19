import { execute } from '#dbConnect'
import { db } from '#store'
import { output, hash } from '#systemLib'

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

const queryInitAccount = () => {
	const sql = `
    select * from ${name} where init = 1
    `
	return execute(sql)
}

const createInitAccount = (account: string, password: string) => {
	const sql = `
    insert into ${name}(
        account, 
        password,
        createTime,
        init
    ) values(?, ?, from_unixtime(?), ?)
    `
	return execute(sql, [account, password, Date.now() / 1000, 1])
}

const init = async () => {
	try {
		const [initAccount] = await queryInitAccount()
		if (initAccount.length !== 0) return
		const account = config.project.root.account
		const password = await hash.encryp(config.project.root.password)
		await createInitAccount(account, password)
	} catch (error) {
		output.danger('初始管理员账号初始化失败, 请检查管理员表在此之前是否已经创建 !')
		throw error
	}
}
init()
