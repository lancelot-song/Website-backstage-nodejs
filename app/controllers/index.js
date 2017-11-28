var Movie = require('../models/movie.js');//引入mongoose编译过的数据库模型

exports.index = function(req, res){
	Movie.fetch(function(err, movies){
		if(err){
			console.log(err)
		}
		res.render('index',{
			title :'首页',
			movies : movies
		});
	})
}