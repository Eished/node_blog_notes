var express = require('express');
var router = express.Router();
const { 
	getList, 
	getDetail,
	newBlog,
	updateBlog,
	delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck.js')
 
router.get('/list', function(req, res, next) {
	let author = req.query.author || ''
	const keyword = req.query.keyword || ''
	if (req.query.isadmin) {
		// 管理员界面
		console.log('is admin')
		if (req.session.username == null) {
			// 未登录
				console.log('is admin but not login')
			res.json(
				new ErrorModel('未登录')
			)
			return
		}
		// 强制查询自己的博客
		author = req.session.username
	}

	const result = getList(author, keyword)
	return result.then(listData => {
		res.json(
			new SuccessModel(listData)
			)
	})
});
 
router.get('/detail', (req, res, next) => {
  	const result = getDetail(req.query.id)
	return result.then(detailData => {
		res.json(
			new SuccessModel(detailData)
		)
	})
});


router.post('/new', loginCheck, (req, res, next) => {
	req.body.author = req.session.username
	const result = newBlog(req.body)
	return result.then(data => {
		res.json(
			new SuccessModel(data)
		)
	})
})

router.post('/update', loginCheck, (req, res, next) => {
	const result = updateBlog(req.query.id, req.body)
	return result.then(value => {
		if (value) {
			res.json(
				new SuccessModel()
			)
		} 
		else {
			res.json(
				new ErrorModel('更新博客失败!')
			) 
		}
	})
})

router.post('/del', loginCheck, (req, res, next) => {
	const author = req.session.username
	const result = delBlog(req.query.id, author)
	return result.then(value => {
		if (value) {
			res.json(
				new SuccessModel()
			) 
		} else {
			res.json(
			new ErrorModel('删除失败！')
			) 
		}
	})
})

module.exports = router;
