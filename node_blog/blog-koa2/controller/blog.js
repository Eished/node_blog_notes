//../blog-koa2/controller/blog.js
const { exec, escape } = require('../db/mysql')
const xss = require('xss')

//博客列表
const getList = async (author, keyword) => {
	let sql = `select * from blogs where 1=1 `
	if (author) {
		author = escape(author)
		sql += `and author=${author} `
	} 
	if (keyword) {
		keyword = escape('%' + xss(keyword) + '%')
		sql += `and title like ${keyword} `
	}
	sql += `order by createtime desc;`
	return await exec(sql)
}

//博客详情
const getDetail = async ( id ) => {
	const sql = `select * from blogs where id=${id}`
	const rows = await exec(sql)
	return rows[0]
	
}

//新建博客
const newBlog = async (blogData = {}) => {
	// blogData 是一个博客对象，包含 title conten 属性
	const title = escape(xss(blogData.title))
	const content = escape(xss(blogData.content))
	const author = escape(blogData.author)
	const createtime = escape(Date.now())

	const sql = `
	insert into blogs (title, content, createtime, author)
	values(${title}, ${content}, ${createtime}, ${author})
	`
	const insertData = await exec(sql)
	return {
		id: insertData.insertId
	}
}

//更新博客
const updateBlog = async (id, blogData = {}) => {
	// id 就是要更新的 id
	// blogData 是一个博客对象，包含 title content 属性
	const title = escape(xss(blogData.title))
	const content = escape(xss(blogData.content))

	const sql = `
		update blogs set title=${title}, content=${content} where id=${id}
	`
	const updateData = await exec(sql)
	if (updateData.affectedRows > 0) {
		return true
	}
	return false
}

//删除博客
const delBlog = async (id, author) => {
	author = escape(author)
	// id 就是要删除的博客的 id 
	const sql = `delete from blogs where id=${id} and author=${author}`
	// console.log(sql)
	const delData = await exec(sql)
	if (delData.affectedRows > 0) {
		return true
	}
	return false
}

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
}