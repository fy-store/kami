import { db } from '#store'
const {
	adminTable: { accountLength, passwordLength, name }
} = db

export default ` create table if not exists ${name}(
    id int auto_increment primary key,
    account varchar(${accountLength}) not null comment '账号',
    password varchar(${passwordLength}) not null comment '密码',
    createTime datetime not null comment '创建时间, UTC时间',
    init tinyint(1) comment '是否为初始管理员, 初始管理员仅只能一位',
    deleteTime datetime comment '删除时间, UTC时间',
    index(account),
    index(createTime),
    index(init),
    index(deleteTime)
)
`
