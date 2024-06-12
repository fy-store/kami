import { db } from '#store'
const {
	adminTable: { accountLength, passwordLength }
} = db

export default ` create table if not exists admin(
    id int auto_increment primary key,
    account varchar(${accountLength}) not null comment '账号',
    password varchar(${passwordLength}) not null comment '密码',
    createTime datetime not null comment '创建时间, UTC时间',
    deleteTime datetime comment '删除时间, UTC时间'
)
`
