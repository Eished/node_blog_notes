const crypto = require('crypto')

// 密钥
const SECRT_KEY = 'ZWiep-2947@.?'

// md5 加密
function md5(content) {
	let md5 = crypto.createHash('md5')
	return md5.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
	const str = `password=${password}&key=${SECRT_KEY}`
	return md5(str)
}
// const result = genPassword('1234')
// console.log(result)

module.exports = {
	genPassword
}