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

// getFileContent('a.json').then(aData => {
// 	console.log('a data', aData)
// 	//返回文件名 b.json
// 	return getFileContent(aData.next)
// }).then(bData => {
// 	console.log('b Data', bData)
// 	//返回文件名 c.json
// 	return getFileContent(bData.next)
// }).then(cData => {
// 	console.log('c Data', cData)
// })

// async await 获取内容
async function readFileData() {
	// 同步写法
	try{
	const aData = await getFileContent('a.json')
	console.log('aData:', aData)
	const bData = await getFileContent(aData.next)
	console.log('bData:', bData)
	const cData = await getFileContent(bData.next)
	console.log('cData:', cData)
	} catch (err) {
		console.log(err)
	}
}

readFileData()

async function readAData() {
	const aData = await getFileContent('a.json')
	return aData
}
async function test() {
	const aData = await readAData()
	console.log('aData:', aData)
}
test()

// 要点 async await
// 1. await 后面可以追加 promise 对象，获取 resolve 的值
// 2. await 必须包裹在 async 函数内
// 3. async 函数执行返回的也是一个 promise 对象
// 4. try-catch 截获 promise 中 reject 的值

// koa2 获取内容