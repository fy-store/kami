import Router from 'koa-router'
import login from './login/index.js'
import admin from './admin/index.js'

const router = new Router()
export default router.use(config.project.api, login.routes(), admin.routes())
