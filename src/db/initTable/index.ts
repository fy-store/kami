import { type TDbCtx } from '../types/index.js'
import session from './session.js'
import admin from './admin.js'

export default async ({ query }: TDbCtx) => {
	await query(session)
	await query(admin)
}
