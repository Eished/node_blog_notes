//../src/controller/blog.js
const { exec, escape } = require('../db/mysql')
const xss = require('xss')

//博客列表
const getList = (author, keyword) => {
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

	// console.log(sql)
	//返回 promise
	return exec(sql)
}

//博客详情
const getDetail = ( id ) => {
	const sql = `select * from blogs where id=${id}`
	return exec(sql).then(rows => {
		return rows[0]})
	
}

//新建博客
const newBlog = (blogData = {}) => {
	// blogData 是一个博客对象，包含 title conten 属性
	const title = escape(xss(blogData.title))
	const content = escape(xss(blogData.content))
	const author = escape(blogData.author)
	const createtime = escape(Date.now())

	const sql = `
	insert into blogs (title, content, createtime, author)
	values(${title}, ${content}, ${createtime}, ${author})
	`

	return exec(sql).then(insertData => {
		return {
			id: insertData.insertId
		}
	})
}

//更新博客
const updateBlog = (id, blogData = {}) => {
	// id 就是要更新的 id
	// blogData 是一个博客对象，包含 title content 属性
	const title = escape(xss(blogData.title))
	const content = escape(xss(blogData.content))

	const sql = `
		update blogs set title=${title}, content=${content} where id=${id}
	`

	return exec(sql).then(updateData => {
		if (updateData.affectedRows > 0) {
			return true
		}
		return false
	})
}

//删除博客
const delBlog = (id, author) => {
	author = escape(author)
	// id 就是要删除的博客的 id 
	const sql = `delete from blogs where id=${id} and author=${author}`
	console.log(sql)
	return exec(sql).then(delData => {
		if (delData.affectedRows > 0) {
			return true
		}
		return false
	})
}

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
}