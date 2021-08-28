const fs = require('fs')
const path = require('path')

const fileName = path.resolve(__dirname, 'data.txt')

// 读取文件内容
fs.readFile(fileName, (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	console.log(data.toString())
	return 
})

const content = '这是新的内容\n'
const opt = {
	flag: 'a' // 追加写入，覆盖用 W
}
fs.writeFile(fileName, content, opt, (err) => {
	if (err) {
		console.log(err)
	}
})
