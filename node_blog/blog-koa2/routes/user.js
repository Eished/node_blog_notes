// ./blog-koa2/routes/users.js
const router = require('koa-router')()
const { login } = require('../controller/user.js')
const { SuccessModel, ErrorModel } = require('../model/resModel')
 
router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
	const {username, password} = ctx.request.body
	const data = await login(username, password)
	if (data.username) {
	// // 操作 cookie
	// res.setHeader('Set-Cookie', `username=${data.username}; path=/; httpOnly; expires=${getCookieExpires()}`)
		ctx.session.username = data.username
		ctx.session.realname = data.realname
		ctx.body = new SuccessModel()
		return
	}
	ctx.body = new ErrorModel('登录失败!')
})

// router.get('/session-test', async function (ctx, next) {
// 	if (ctx.session.viewCount == null) {
// 		ctx.session.viewCount = 0
// 	}
// 	ctx.session.viewCount++
// 	ctx.body = {
// 		errno: 0,
// 		viewCount: ctx.session.viewCount
// 	}
// })

module.exports = router
