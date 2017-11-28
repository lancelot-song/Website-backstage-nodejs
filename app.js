var http = require('http'),
	path = require('path'),
	express = require('express'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),//调用express session必须的中间件
	MongoStore = require('connect-mongo')(session),//存储session到mongo的中间件
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),//express依赖 用于解析数据格式（JSON/二进制/文本）
	serveStatic = require('serve-static'),//express依赖 用于指定静态资源加载的路径
	morgan = require('morgan'),//开发环境的日志输出工具
	app = express(),
	port = process.env.PORT || 8083;

var dburl = 'mongodb://127.0.0.1:27017/imooc';

mongoose.Promise = global.Promise;
mongoose.connect(dburl,{
  useMongoClient: true
});

app.set('views','./app/views/pages');//设置views根目录
app.set('view engine','jade');//设置模板引擎
app.use(bodyParser.urlencoded({ extended: true }));//设置express中间件，对数据格式文本化
app.use(serveStatic('public'));
app.use(cookieParser());
app.use(session({
	secret : 'lszh secret',
    resave: false,
    saveUninitialized: true,
	store : new MongoStore({
		url : dburl,
		collection : 'sessions'
	})
}));

if(app.get('env') === 'development'){//开发环境配置 便于调试
	app.set('showStackError', true);//打印错误信息
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;//代码美化
	mongoose.set('debug', true);
}

app.listen(port);


console.log("success");

require('./config/routers')(app);//载入路由配置文件