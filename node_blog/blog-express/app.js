var createError = require('http-errors'); // 处理404 生成错误页 
var express = require('express');
var path = require('path'); // 路径
const fs = require('fs')
var cookieParser = require('cookie-parser'); // 解析 Cookie
var logger = require('morgan'); // 记录日志
const session = require('express-session')
// var indexRouter = require('./routes/index'); // 引用路由
// var usersRouter = require('./routes/users'); // 引用路由
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const RedisStore = require('connect-redis')(session)

var app = express(); // 生成实例

// view engine setup
app.set('views', path.join(__dirname, 'views')); // 前端
app.set('view engine', 'jade'); // 前端

// 记录日志
const ENV = process.env.NODE_ENV
if (ENV != 'production') {
	// 开发环境
	app.use(logger('dev'))
} else {
	// 线上环境
	const logFileName = path.join(__dirname, 'logs', 'access.log')
	const writeStream = fs.createWriteStream(logFileName, {
		flags: 'a'
	})
	app.use(logger('combined', {
		stream: writeStream
	}))
}
// app.use(logger('dev',{
// 	stream: process.stdout
// })); 
app.use(express.json()); // 等于 getPostData()
app.use(express.urlencoded({ extended: false })); // 等于 getPostData() 解析其它格式数据
app.use(cookieParser()); //解析 Cookie
app.use(express.static(path.join(__dirname, 'public'))); // 注册静态文件

const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
	client: redisClient
})
app.use(session({
	secret:'QZlp#31_59!',
	cookie: {
		// path: '', //默认配置
		// httpOnly: true, //默认配置
		maxAge: 24*60*60*1000
	},
	store: sessionStore
}))
// app.use('/', indexRouter); // 注册路由
// app.use('/users', usersRouter); // 注册路由
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler 获取404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler 报错
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
