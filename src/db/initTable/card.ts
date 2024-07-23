import { db, card } from '#store'
const {
	cardTable: { name, descLength, stateLength, titleLength, tokenLength }
} = db

const { disabled, notUse, use } = card.state

export default `create table if not exists ${name}(
    id int auto_increment primary key,
    token varchar(${tokenLength}) not null comment '卡密',
    createTime datetime not null comment '创建时间, UTC时间',
    title varchar(${titleLength}) not null comment '标题',
    \`desc\` varchar(${descLength}) not null comment '描述',
    content text not null comment '内容',
    remark text not null comment '备注',
    state varchar(${stateLength}) null default '${notUse}' comment '${disabled}-禁用中, ${notUse}-未使用, ${use}-已使用',
    useTime datetime comment '使用时间',
    deleteTime datetime comment '删除时间, UTC时间',
    index(token),
    index(createTime),
    index(title),
    index(state),
    index(useTime),
    index(deleteTime)
)`
