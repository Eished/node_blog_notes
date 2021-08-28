const { 
	getList, 
	getDetail,
	newBlog,
	updateBlog,
	delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

// 统一的登录验证函数
const loginCheck = (req) => {
	if (!req.session.username) {
		return Promise.resolve( 
			new ErrorModel('未登录')
		) 
	}
}

const handleBlogRouter = (req, res) => {
	const method = req.method //GET POST
	const id = req.query.id

	//获取博客列表
	if (method === 'GET' && req.path === '/api/blog/list') {
		let author = req.query.author || ''
		const keyword = req.query.keyword || ''
		// const listData = getList(author, keyword)
		// return new SuccessModel(listData)

		if (req.query.isadmin) {
			// 管理员界面
			const loginCheckResult = loginCheck(req)
			if (loginCheckResult) {
				// 未登录
				return loginCheckResult
			}
			// 强制查询自己的博客
			author = req.session.username

		}

		const result = getList(author, keyword)
		return result.then(listData => {
			return new SuccessModel(listData)
		})
	}

	//获取博客详情
	if (method === 'GET' && req.path ==='/api/blog/detail') {
		const result = getDetail(id)
		return result.then(detailData => {
			return new SuccessModel(detailData)
		})
	}

	//新建博客
	if (method === 'POST' && req.path === '/api/blog/new') {
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			// 未登录
			return loginCheckResult
		}

		// const author ='zhangsan' //作者假数据，等待登录
		req.body.author = req.session.username
		const result = newBlog(req.body)
		return result.then(data => {
			return new SuccessModel(data)
		})
	}

	//更新博客
	if (method === 'POST' && req.path === '/api/blog/update') {
		// const author ='zhangsan' //作者假数据，等待登录
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			// 未登录
			return loginCheckResult
		}

		const result = updateBlog(id, req.body)
		return result.then(value => {
			if (value) {
				return new SuccessModel()
			} 
			return new ErrorModel('Failed!')
		})
	}
	

	//删除博客
	if (method === 'POST' && req.path === '/api/blog/del') {
		// const author ='zhangsan' //作者假数据，等待登录
		const loginCheckResult = loginCheck(req)
		if (loginCheckResult) {
			// 未登录
			return loginCheckResult
		}

		// const author ='zhangsan' //作者假数据，等待登录

		// req.body.author = req.session.username
		const author = req.session.username
		const result = delBlog(id, author)
		return result.then(value => {
			if (value) {
				return new SuccessModel()
			}
			return new ErrorModel('删除失败!')
		})
	}
}

module.exports = handleBlogRouter