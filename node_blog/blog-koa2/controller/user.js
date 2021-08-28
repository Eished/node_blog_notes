// ./blog-koa2/controller/users.js
const { exec, escape } = require('../db/mysql.js')
const { genPassword } = require('../utils/cryp.js')
const xss = require('xss')
// 登录验证
const login = async (username, password) => {
	username = escape(xss(username))

	password = genPassword(password)
	password = escape(password)

	const sql = `
		select username, realname from users where username=${username} and password=${password}
	`
	const rows = await exec(sql)
	return rows[0] || {}
}

module.exports = {
	login
}