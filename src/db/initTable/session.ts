import { db } from '#store'
const {
	sessionTable: { idLenght, name }
} = db

export default `create table if not exists ${name} (
    id varchar(${idLenght}) primary key not null comment '会话ID',
    content json not null comment '会话内容',
    deleteTime datetime comment '删除时间, UTC时间',
    index(deleteTime)
)`
