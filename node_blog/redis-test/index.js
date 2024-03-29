const redis = require('redis')

// 创建客户端
const redisClient = redis.createClient(6379, '127.0.0.1')
redisClient.on('error', err =>{
	console.error(err)
})

// 测试
redisClient.set('myname2', 'zhangsan张三', redis.print)
redisClient.get('myname2', (err, val) => {
	if (err) {
		console.log(err)
		return
	}
	console.log('val', val)

	// 退出
	redisClient.quit()
})