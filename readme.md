# Node.js搭建博客

## 开发接口（不用框架）

### http请求概述

- DNS 解析，建立 TCP 连接，发送 http 请求
- server 接收到 http 请求，处理并返回数据
- 客户端接收到返回数据，处理数据（例如渲染、执行JS）

### Node.js 处理http 请求

- get 请求和 querystring
- post 请求和 postdata
- 路由（接口、地址）

``` javascript
const http = require('http');
const server = http.createServer((req,res) => {
    res.end('hello world!');
});
server.listen(8000);
//浏览器访问 http://localhost:8000/
```

#### Node.js 处理 get 请求

- get  请求，客户端向 server 端获取数据，如查询博客列表
- 通过 querystring 来传递数据，如 a.html?a=100&b=200
- 浏览器直接访问，发送 get 请求

``` javascript
const http = require('http');
const querystring = require('querystring');
const server = http.createServer((req,res) => {
    console.log(req.method) //GET
    const url = req.url //获取请求的完整 URL
    //关键解析[0]是'?'前的内容, [1]是'?'后内容
    req.query = querystring.parse(url.split('?')[1]) 
    res.end(JSON.stringify(req.query)); //将 querystring 返回
});
server.listen(8000);
//浏览器访问 http://localhost:8000/
```

#### Node.js 处理 post 请求

- post 请求，即客户端要像服务端传递数据，如新建博客
- 通过 post data 传递数据，后面解释
- 浏览器无法直接模拟，需要手写JS，或者使用 postman app

``` javascript
const http = require('http')
const server = http.createServer((req, res) => {
    if (req.method === 'POST'){ 
        // POST 必须大写
        //数据格式
        console.log('content-type: ', req.headers['content-type'])
        //接收数据
        let postData = ''
        //开始接收数据
        req.on('data', chunk => {
			postData += chunk.toString()
        })
        //结束数据接收
        req.on('end'， () => {
            console.log('postData:', postData)
            res.end('hello world!') //在这里返回，因为是异步
        })
    }
})
server.listen(300)
```

#### Node.js 处理路由

- https://github.com/username/xxx 每个斜线后面的唯一标识就是路由

#### Node.js 综合应用

```javascript
const http = require('http')
const querystring = require('querystring')

const server = http.createServer((req, res) => {
    const method = req.method
    const url = req.url
    const path = url.split('?')[0] //重点：split('?'[0])语法弄清楚
    const query = querystring.parse(url.split('?')[1])

    //设置返回值格式为 JSON
    res.setHeader('Content-type', 'application/json')
    
    //返回的数据
    const resData = {
        method,
        url,
        path,
        query
    }
    
    //返回
    if (method === 'GET') {
        res.end(
            JSON.stringify(req.query)
        )
    }
    
    if (req.method === 'POST'){
        let postData = ''
        //res.on('data')指每次发送的数据
        //chunk 逐步接收数据 req绑定一个data方法 chunk是变量
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        //req.on(end)数据发送完成；
        req.on('end', () => {
            console.log('postData:', postData)
            console.log('resData:', resData)
            resData.postData = postData
            //返回
            res.end(
                JSON.stringify(resData)
            )
        })
    }

})

server.listen(300)
console.log('OK')
```

### 搭建开发环境

- 从零搭建，不使用框架
- 使用 nodemon 监测文件变化，自动重启 node
- 使用 cross-env 设置环境变量，兼容Mac Linux 和 Windows
- 配置完后使用 ` $ npm run dev ` 命令启动项目

#### 开始搭建

**使用npm安装上述插件，设置npm镜像源**

1. 查看npm源地址
    `npm config list`

2. 结果:
    `metrics-registry = "http://registry.npm.taobao.org/"`

3. 修改registry地址，比如修改为淘宝镜像源。
    `npm set registry https://registry.npm.taobao.org/`
    如果有一天你肉身FQ到国外，用不上了，用rm命令删掉它
    `npm config rm registry`

4. ` npm install -g nodemon `
5. ` npm install -g cross-env `

**新建文件夹blog_1，在里面新建bin文件夹和app.js，在bin里面新建www.js文件**

``` javascript
//package.json 代码 注意： =不能有空格
{
  "name": "blog_1",
  "version": "1.0.0",
  "description": "",
  "main": "www.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=dev nodemon ./bin/www.js",
    "prd": "cross-env NODE_ENV=production nodemon ./bin/www.js"
  },
  "author": "",
  "license": "ISC"
}

//app.js 代码
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

const serverHandle = (req, res) => {
	//设置返回值格式 JSON
	res.setHeader('Content-type', 'application/json')

	// const resData = {
	// 	name: 'zhang',
	// 	site: 'imooc',
	// 	env: process.env.NODE_ENV
	// }

	// res.end(
	// 	JSON.stringify(resData)
	// )
	
	//处理 blog 路由
	const blogData = handleBlogRouter(req, res)
	if (blogData) {
		res.end(
			JSON.stringify(blogData)
		)
		return
	}
	//处理 user 路由
	const userData = handleUserRouter(req, res)
	if (userData) {
		res.end(
			JSON.stringify(userData)
		)
		return
	}
	//未命中路由，返回404
	res.writeHead(404, {"Content-type": "text/plain"})
	res.write("404 Not Found\n")
	res.end()
}

module.exports = serverHandle

//www.js 代码
const http = require('http')

const PORT = 300
const serverHandle = require('../app')
const server = http.createServer(serverHandle)
server.listen(PORT)
```

### 开发接口

#### 初始化路由

- 初始化路由：根据之前设计方案，做出路由
- 返回假数据：将路由和数据处理分离，以符合设计原则

#### 接口设计方案

| 描述               | 接口             | 方法 | url参数                         | 备注                      |
| ------------------ | ---------------- | ---- | ------------------------------- | ------------------------- |
| 获取博客列表       | /api/blog/list   | get  | author 作者，keyword 搜索关键字 | 参数为空则不进行查询过滤  |
| 获取一篇博客的内容 | /api/blog/detail | get  | id                              |                           |
| 新增一篇博客       | /api/blog/new    | post |                                 | post 中有新增的信息       |
| 更新一篇博客       | /api/blog/update | post | id                              | postData 中有更新信息     |
| 删除一篇博客       | /api/blog/del    | post | id                              |                           |
| 登录               | /api/user/login  | post |                                 | postData 中有用户名和密码 |

具体代码：

```javascript
//../src/router/user.js
const handleUserRouter = (req, res) => {
	const method = req.method //GET POST

	//登录
	if (method === 'POST' && req.path === '/api/user/login') {
		return {
			msg: '这是登录的接口'
		}
	}
}

module.exports = handleUserRouter

// ../src/router/blog.js
const handleUserRouter = (req, res) => {
	const method = req.method //GET POST

	//登录
	if (method === 'POST' && req.path === '/api/user/login') {
		return {
			msg: '这是登录的接口'
		}
	}
}

module.exports = handleUserRouter
```

#### 开发路由 博客列表

1. 业务分层 拆分业务

   - createServer 业务单独放在 ` ../bin/www.js `
   - 系统基本设置、基本信息 ` app.js ` 放在根目录
   - 路由功能 ` ../src/router/xxx.js `
   - 数据管理 ` ../src/contoller/xxx.js `
   - 数据处理

2. 博客列表代码

   ```javascript
   // ../app.js 
   const handleBlogRouter = require('./src/router/blog')
   const handleUserRouter = require('./src/router/user')
   const querystring = require('querystring')
   
   const serverHandle = (req, res) => {
   	//设置返回值格式 JSON
   	res.setHeader('Content-type', 'application/json')
   	
   	// 获取 path
   	const url = req.url
   	req.path = url.split('?')[0]
   
   	//解析 query
   	req.query = querystring.parse(url.split('?')[1])
   
   	// const resData = {
   	// 	name: 'zhang',
   	// 	site: 'imooc',
   	// 	env: process.env.NODE_ENV
   	// }
   
   	// res.end(
   	// 	JSON.stringify(resData)
   	// )
   	
   	//处理 blog 路由
   	const blogData = handleBlogRouter(req, res)
   	if (blogData) {
   		res.end(
   			JSON.stringify(blogData)
   			// JSON.stringify({
   			// 	errno: -1,
   			// 	message: '传输失败'
   			// })
   		)
   		return
   	}
   	//处理 user 路由
   	const userData = handleUserRouter(req, res)
   	if (userData) {
   		res.end(
   			JSON.stringify(userData)
   		)
   		return
   	}
   	//未命中路由，返回404
   	res.writeHead(404, {"Content-type": "text/plain"})
   	res.write("404 Not Found\n")
   	res.end()
   }
   
   module.exports = serverHandle
   ```

   ```javascript
   // ../src/controller/blog.js
   const getList = (author, keyword) => {
   	//先返回假数据(格式正确)
   	return [
   		{
   			id: 1,
   			title: '标题A',
   			content: '内容A',
   			createTime: 20191101,
   			author: 'zhangsan'
   		},
   		{
   			id: 2,
   			title: '标题2',
   			content: '内容2',
   			createTime: 20191102,
   			author: 'zhangsan2'
   		},
   		{
   			id: 3,
   			title: '标题3',
   			content: '内容3',
   			createTime: 20191103,
   			author: 'zhangsan3'
   		}
   	]
   }
   
   const getDetail = ( id ) => {
   	//先返回假数据(格式正确)
   	return {
   		id: 3,
   		title: '标题3',
   		content: '内容3',
   		createTime: 20191103,
   		author: 'zhangsan3'
   	}
   }
   
   module.exports = {
   	getList,
   	getDetail
   }
   ```

   ```javascript
   // ../src/router/blog.js
   const { getList, getDetail } = require('../controller/blog')
   const { SuccessModel, ErrorModel } = require('../model/resModel')
   
   const handleBlogRouter = (req, res) => {
   	const method = req.method //GET POST
   
   	//获取博客列表
   	if (method === 'GET' && req.path === '/api/blog/list') {
   		const author = req.query.author || ''
   		const keyword = req.query.keyword || ''
   		const listData = getList(author, keyword)
   		return new SuccessModel(listData)
   		// return {
   		// 	msg: '这是博客列表的接口'
   		// }
   	}
   
   	//获取博客详情
   	if (method === 'GET' && req.path ==='/api/blog/detail') {
   		const id = req.query.id
   		const data = getDetail(id)
   		return new SuccessModel(data)
   	}
   
   	//新建博客
   	if (method === 'POST' && req.path === '/api/blog/new') {
   		return {
   			msg: '这是新建博客的接口'
   		}
   	}
   
   	//更新博客
   	if (method === 'POST' && req.path === '/api/blog/update') {
   		return {
   			msg: '这是更新博客的接口'
   		}
   	}
   
   	//删除博客
   	if (method === 'POST' && req.path === '/api/blog/del') {
   		return {
   			msg: '这是删除博客的接口'
   		}
   	}
   }
   
   module.exports = handleBlogRouter
   ```

   ```javascript
   // ../src/model/resModel.js
   class BaseModel {
   	constructor(data, message) {
   		if (typeof data === 'string') {
   			this.message = data
   			data = null
   			message = null
   		}
   		if (data) {
   			this.data = data
   		}
   		if (message) {
   			this.message = message
   		}
   	}
   }
   
   class SuccessModel extends BaseModel {
   	constructor(data, message) {
   		super(data, message)
   		this.errno = 0
   	}
   }
   
   class ErrorModel extends BaseModel {
   	constructor(data, message) {
   		super(data, message)
   		this.errno = -1
   	}
   }
   
   module.exports = {
   	SuccessModel,
   	ErrorModel
   }
   ```

#### 开发路由 博客详情

- 博客代码同上一章

- 使用 promise 读取文件，避免 callback-hell

  ```javascript
  const fs =require('fs')
  const path = require('path')
  /*
  // callback 方式获取一个文件的内容
  function getFileContent(fileName, callback) {
  	//resolve 方法拼接文件目录，带引号的是字符串，不带的是变量 
  	const fullFileName = path.resolve(__dirname, 'files', fileName) 
  fs.readFile(fullFileName, (err, data) => {
  	if (err) {
  		console.error(err)
  		return
  	}
  	callback(
  		JSON.parse(data.toString())
  	)
  })
  
  }
  
  //测试 callback-hell
  getFileContent('a.json', aData => {
  	console.log('a data', aData)
  	getFileContent(aData.next, bData => {
  		console.log('b data', bData)
  		getFileContent(bData.next, cData => {
  		console.log('c data', cData)
  		})
  	})
  })*/
  
  //用 promise 获取文件内容
  function getFileContent(fileName) {
  	const promise = new Promise((resolve, reject) => {
  		const fullFileName = path.resolve(__dirname, 'files', fileName) 
  		console.log('fullFileName：', fullFileName)
  
  		fs.readFile(fullFileName, (err, data) => {
  			if (err) {
  				reject(err)
  				console.log('出错了')
  				return
  			}
  			resolve(
  				JSON.parse(data.toString())
  			)
  		})
  	})
  	return promise
  }
  
  getFileContent('a.json').then(aData => {
  	console.log('a data', aData)
  	//返回文件名 b.json
  	return getFileContent(aData.next)
  }).then(bData => {
  	console.log('b Data', bData)
  	//返回文件名 c.json
  	return getFileContent(bData.next)
  }).then(cData => {
  	console.log('c Data', cData)
  })
  
  // async await 获取内容
  // koa2 获取内容
  ```

  

#### 开发路由 （处理POSTData）

```javascript
// app.js 代码
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const querystring = require('querystring')

//用于处理 post data
const getPostData = (req) => {
	const promise = new Promise((resolve, reject) => {
		if (req.method !== 'POST') {
			resolove({})
			return
		}
		if (req.headers['content-type'] !== 'application/json') {
			resolove({})
			return
		}
		let postData = ''
		//开始接收数据
		req.on('data', chunk => {
			postData += chunk.toString()
		})
		//结束接收数据
		req.on('end', () => {
			if (!postData) {
				resolve({})
				return
			}
			resolve(
				JSON.parse(postData)
			)
		})
	})
	return promise
}

const serverHandle = (req, res) => {
	//设置返回值格式 JSON
	res.setHeader('Content-type', 'application/json')
	
	// 获取 path
	const url = req.url
	req.path = url.split('?')[0]

	//解析 query
	req.query = querystring.parse(url.split('?')[1])

	//处理 postData
	getPostData(req).then(postData => {
		req.body = postData

		//处理 blog 路由
		const blogData = handleBlogRouter(req, res)
		if (blogData) {
			res.end(
				JSON.stringify(blogData)
				// JSON.stringify({
				// 	errno: -1,
				// 	message: '传输失败'
				// })
			)
			return
		}
		//处理 user 路由
		const userData = handleUserRouter(req, res)
		if (userData) {
			res.end(
				JSON.stringify(userData)
			)
			return
		}
		//未命中路由，返回404
		res.writeHead(404, {"Content-type": "text/plain"})
		res.write("404 Not Found\n")
		res.end()
	})
}

module.exports = serverHandle
```

#### 开发路由 （新建和更新博客路由）

``` javascript
// ../src/router/blog.js
const { 
	getList, 
	getDetail,
	newBlog,
	updateBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
	const method = req.method //GET POST
	const id = req.query.id

	//获取博客列表
	if (method === 'GET' && req.path === '/api/blog/list') {
		const author = req.query.author || ''
		const keyword = req.query.keyword || ''
		const listData = getList(author, keyword)
		return new SuccessModel(listData)
		// return {
		// 	msg: '这是博客列表的接口'
		// }
	}

	//获取博客详情
	if (method === 'GET' && req.path ==='/api/blog/detail') {
		const data = getDetail(id)
		return new SuccessModel(data)
	}

	//新建博客
	if (method === 'POST' && req.path === '/api/blog/new') {
		const data = newBlog(req.body)
		return new SuccessModel(data)
	}

	//更新博客
	if (method === 'POST' && req.path === '/api/blog/update') {
		const result = updateBlog(id, req.body)
		if (result) {
			return new SuccessModel('Update Successed!')
		} else {
			return new ErrorModel('Update Failed!')
		}
	}

	//删除博客
	if (method === 'POST' && req.path === '/api/blog/del') {
		return {
			msg: '这是删除博客的接口'
		}
	}
}

module.exports = handleBlogRouter
```

``` javascript
// ../src/controller/blog.js
//博客列表
const getList = (author, keyword) => {
	//先返回假数据(格式正确)
	return [
		{
			id: 1,
			title: '标题A',
			content: '内容A',
			createTime: 20191101,
			author: 'zhangsan'
		},
		{
			id: 2,
			title: '标题2',
			content: '内容2',
			createTime: 20191102,
			author: 'zhangsan2'
		},
		{
			id: 3,
			title: '标题3',
			content: '内容3',
			createTime: 20191103,
			author: 'zhangsan3'
		}
	]
}

//博客详情
const getDetail = ( id ) => {
	//先返回假数据(格式正确)
	return {
		id: 3,
		title: '标题3',
		content: '内容3',
		createTime: 20191103,
		author: 'zhangsan3'
	}
}

//新建博客
const newBlog = (blogData = {}) => {
	// blogData 是一个博客对象，包含 title conten 属性
	return {
		id: 3 //表示新建博客，插入到数据表里面的 id
	}
}

//更新博客
const updateBlog = (id, blogData = {}) => {
	// id 就是要更新的 id
	// blogData 是一个博客对象，包含 tiltle content 属性
	console.log('updateBlog:', id, blogData)
	return true
}

module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog

}
```

#### 开发路由 （删除博客路由和登录博客路由）

- **删除博客**

``` javascript
// ../src/controller/blog.js 里面增加下列代码
//删除博客
const delBlog = (id) => {
	// id 就是要删除的博客的 id
	console.log('delBlog:', id)
	return true
}
module.exports = {
	getList,
	getDetail,
	newBlog,
	updateBlog,
	delBlog
}
```

``` javascript
//  ../src/router/blog.js 里面增加下列代码
	const { 
	getList, 
	getDetail,
	newBlog,
	updateBlog,
	delBlog
	} = require('../controller/blog')
    
    //删除博客
	if (method === 'POST' && req.path === '/api/blog/del') {
		const result = delBlog(id)
		if (result) {
			return new SuccessModel('Delete Successed!')
		} else {
			return new ErrorModel('Delete Failed!')
		}
	}
```

- **登录博客**

``` javascript
// ../src/router/.user.js 代码
const { loginCheck } = require('../controller/user') //'路径里面不能有空格'
const { SuccessModel, ErrorModel } = require('../model/resModel')

const handleUserRouter = (req, res) => {
	const method = req.method //GET POST

	//登录
	if (method === 'POST' && req.path === '/api/user/login') {
		const {username, password } = req.body
		const result = loginCheck(username, password)
		if (result) {
			return new SuccessModel('login successed!')
		}
		return new ErrorModel('login failed!')
	}
}

module.exports = handleUserRouter
```

``` javascript
// ../src/controller/user.js 代码
//登录验证
const loginCheck = (username, password) => {
	console.log('username:', username, 'password:', password)
	if (username === 'zhangsan' && password === '123') {
		return true
	}
	return false
}

module.exports = {
	loginCheck
}
```

#### 总结

- node.js 处理 http 请求的常用技能，postman 的使用
- node,js 开发博客项目的接口（未连接数据库，未登录使用）
- 为何要将 router 和 controller 分开？

#### 补充：路由和 API

## 使用数据库

### 使用cookie

### redis

### stream

### 日志

### 攻击

## 使用express框架开发博客



