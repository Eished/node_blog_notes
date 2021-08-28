const fs = require('fs')
const path = require('path')
const readline = require('readline')

// 解析文件名
const fileName = path.join(__dirname, '../', '../','logs', 'access.log')
// 创建 readStream 
const readStream = fs.createReadStream(fileName)

// 创建 readline 对象
const rl = readline.createInterface({
	input: readStream
})

let chromeNum = 0
let sum = 0

// 逐行读取
rl.on('line', (lineData) => {
	if (!lineData) {
		return
	}
	sum++

	const arr = lineData.split('--')
	if (arr[3] && arr[3].indexOf('Chrome') > 0) {
		// 累加 chrome 数量
		chromeNum++
	}

})

// 监听读取完成
rl.on('close', () => {
	console.log('访问总数: ', sum, '\nchrome 数量：', chromeNum, '\nchrome 占比：', chromeNum / sum)
})