const router = require('koa-router')()
const { 
	getList, 
	getDetail,
	newBlog,
	updateBlog,
	delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck.js')

router.prefix('/api/blog')

router.get('/list', async function (ctx, next) {
	let author = ctx.query.author || ''
	const keyword = ctx.query.keyword || ''
	if (ctx.query.isadmin) {
		// 管理员界面
		console.log('is admin')
		if (ctx.session.username == null) {
			// 未登录
			// console.log('is admin but not login')
			ctx.body = new ErrorModel('未登录')
			return
		}
		// 强制查询自己的博客
		author = ctx.session.username
	}

	const listData = await getList(author, keyword) 
	ctx.body = new SuccessModel(listData)

})

router.get('/detail', async function (ctx, next) {
	const detailData = await getDetail(ctx.query.id)
	ctx.body = new SuccessModel(detailData)
})

router.post('/new', loginCheck, async function (ctx, next) {
	const body = ctx.request.body
	body.author = ctx.session.username
	const data = await newBlog(body)
	ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
	const value = await updateBlog(ctx.query.id, ctx.request.body)
	if (value) {
		ctx.body = new SuccessModel()
	} else {
		ctx.body = new ErrorModel('更新博客失败!')
	}
})

router.post('/del', loginCheck, async function (ctx, next) {
	const author = ctx.session.username
	const value = await delBlog(ctx.query.id, author)
	if (value) {
		ctx.body = new SuccessModel()
	} else {
		ctx.body = new ErrorModel('删除失败！')
	}
})

module.exports = router
