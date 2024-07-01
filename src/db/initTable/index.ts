import { type TDbCtx } from '../types/index.js'
import session from './session.js'
import ipList from './ipList.js'
import admin from './admin.js'
import card from './card.js'

export default async ({ query }: TDbCtx) => {
	await query(session)
	await query(ipList)
	await query(admin)
	await query(card)
}
