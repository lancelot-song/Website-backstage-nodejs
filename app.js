var http = require('http'),
	path = require('path'),
	express = require('express'),
	mongoose = require('mongoose'),
	_ = require('underscore'),
	Movie = require('./models/movie.js'),//引入mongoose编译过的数据库模型
	bodyParser = require('body-parser'),//express依赖 用于转换数据格式 表单提交时用
	serveStatic = require('serve-static'),//express依赖 用于指定静态资源加载的路径
	moment = require('moment'),//用于格式化时间
	app = express();

app.locals.moment = moment;
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/imooc',{
  useMongoClient: true
});

var port = process.env.PORT || 3000;

app.set('views','./views/pages');//设置views根目录
app.set('view engine','jade');//设置模板引擎
app.use(bodyParser.urlencoded({ extended: true }));//对表单数据进行格式化
app.use(serveStatic('public'));


app.listen(port);
console.log("success")

app.get('/', function(req, res){
	Movie.fetch(function(err, movies){
		console.log(movies)
		if(err){
			console.log(err)
		}
		res.render('index',{
			title :'首页',
			movies : movies
		});
	})
});
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
app.get('/admin/movie', function(req, res){
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

//拿到从后台录入页 post来的数据
app.post('/admin/movie/new', function(req, res){
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

})
//更新数据
app.get('/admin/update/:id',function(req, res){
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
})
app.get('/admin/list', function(req, res){
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
app.delete('/admin/list', function(req, res){
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