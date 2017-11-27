var http = require('http'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	Movie = require('./models/movie.js'),//引入mongoose编译过的数据库模型
	User = require('./models/user.js'),//引入User数据库模型
	bodyParser = require('body-parser'),//express依赖 用于解析数据格式（JSON/二进制/文本）
	serveStatic = require('serve-static'),//express依赖 用于指定静态资源加载的路径
	moment = require('moment'),//用于格式化时间
	app = express();

app.locals.moment = moment;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/imooc',{
  useMongoClient: true
});

var port = process.env.PORT || 8083;

app.set('views','./views/pages');//设置views根目录
app.set('view engine','jade');//设置模板引擎
app.use(bodyParser.urlencoded({ extended: true }));//设置express中间件，对数据格式文本化
app.use(serveStatic('public'));


app.listen(port);
console.log("success")

/************************** 前台路由 *****************************/

//首页
app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title :'首页',
			movies : movies
		});
	})
});

//详情页
app.get('/movie/:id', function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err)
		}
		res.render('detail',{
			title :'详情页',
			movie : movie
		});
	});
});


/************************** 后台路由 *****************************/

app.get('/admin/item', function(req, res){
	res.redirect('/admin/item/list');
})

//后台录入
app.get('/admin/item/create', function(req, res){
	res.render('admin',
		{
			title:'后台录入页',
			movie : {
				title : '',
				doctor : '',
				country : '',
				language : '',
				year : '',
				flash: '',
				poster : '',
				summary : ''
			}
		}
	);
});

//接收录入数据请求
app.post('/admin/item/create/new', function(req, res){
	console.log("join post")
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if( id !== 'undefined'){//如果这个id已存在 则重新写入新数据
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err){
					console.log(err) 
				}
				res.redirect('/movie/' + movie._id);
			})
		})
	}
	else{
		_movie = new Movie({
			title : movieObj.title,
			doctor : movieObj.doctor,
			country : movieObj.country,
			language : movieObj.language,
			year : movieObj.year,
			summary : movieObj.summary,
			poster : movieObj.poster,
			flash : movieObj.flash
		})
		_movie.save(function(err, movie){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movie._id);
		})
	}
});

//更新数据
app.get('/admin/item/update/:id',function(req, res){
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			res.render('admin',{
				title : '后台更新页',
				movie : movie
			})
		})
	}
});


//录入数据的列表
app.get('/admin/item/list', function(req, res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'后台列表页',
			movies : movies
		})
	})
});

//列表删除处理
app.delete('/admin/item/list', function(req, res){
	var id = req.query.id;
	if(id){
		Movie.remove({_id : id}, function(err, movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({status : 1});
			}
		})
	}
})


/************************** 用户路由 *****************************/

//用户注册 
app.post('/user/signup', function(req, res){
	var _user = req.body.user;
	User.findOne({ name : _user.name}, function(err, user){
		if(err) console.log(err);

		if(user){
			return res.json({
				status : 0,
				info : "用户已存在"
			})
		}
		else{
			var user = new User(_user);
			user.save(function(err, user){
				if(err) console.log(err);

				return res.json({
					status : 1,
					url : '/admin/userlist'
				})
			});
		}
	})
});

//用户登录
app.post('/user/signin', function(req, res){
	var _user = req.body.user,
		name = _user.name,
		pw = _user.password;

	User.findOne({ name : name }, function(err, user){
		if(err) console.log(err);

		if(!user){
			return res.json({
				status : 0,
				info : "账号或密码错误" 
			})
		}
		user.comparePassword(pw, function(err, isMatch){
			if(err) console.log(err);

			if(isMatch){
				return res.json({
					status : 1
				})
			}
			else{
				return res.json({
					status : 0,
					info : "账号或密码错误"
				})
			}
		})
	});
});

//所有用户列表
app.get('/admin/userlist', function(req, res){
	User.fetch(function(err, users){
		if(err) console.log(err);
		res.render('userlist',{
			title :'注册用户列表',
			users : users
		});
	})
});

//删除用户
app.delete('/admin/userlist', function(req, res){
	var id = req.body.id;
	if(id){
		User.remove({_id : id}, function(err, user){
			if(err){
				console.log(err)
			}
			else{
				console.log(user);
				res.json({status : 1});
			}
		})
	}
});