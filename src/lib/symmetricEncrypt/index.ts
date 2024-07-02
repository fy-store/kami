/**
 * 当 key 和 iv 文件不存在时自动生成
 */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const keyPath = path.join(import.meta.dirname, './KEY')
try {
	fs.accessSync(keyPath, fs.constants.F_OK | fs.constants.R_OK)
} catch (error) {
	const key = crypto.randomBytes(32) // 256-bit key for AES-256
	fs.writeFileSync(keyPath, key)
}

const ivPath = path.join(import.meta.dirname, './IV')
try {
	fs.accessSync(ivPath, fs.constants.F_OK | fs.constants.R_OK)
} catch (error) {
	// 密钥和初始化向量（IV）
	const iv = crypto.randomBytes(16) // 128-bit IV for AES
	fs.writeFileSync(ivPath, iv)
}

const key = fs.readFileSync(keyPath)
const iv = fs.readFileSync(ivPath)

/**
 * 对称加密
 * @param text 需要加密的文本
 * @returns 加密后的文本
 */
export const encrypt = (text: string) => {
	const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
	let encrypted = cipher.update(text, 'utf8', 'hex')
	encrypted += cipher.final('hex')
	return encrypted
}

/**
 * 对称解密
 * @param text 需要解密的密码
 * @returns 解密后的文本
 */
export const decrypt = (pwdText: string) => {
	const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
	let decrypted = decipher.update(pwdText, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	return decrypted
}
