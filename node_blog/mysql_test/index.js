const mysql = require('mysql')

//创建连接对象
const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root2019',
	port: '3306',
	database: 'myblog'
})

//开始连接
con.connect()

// 执行 SQL 语句
const sql = `update users set realname='李四二' where username='lisi';`
// const sql = `select * from blogs;`
// const sql = `insert into blogs (title,content,createtime,author)values('标题A','内容A','1573989043149','zhangsan');`
con.query(sql, (err, result) => {
	if (err) {
		console.log(err)
		return
	}
	console.log(result)
})

//关闭连接
con.end()