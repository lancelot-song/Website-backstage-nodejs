var _ = require('underscore'),//类似于jquery的方法扩展库 如extend()
	Movie = require('../models/movie.js'),
	Comment = require('../models/comment.js');

exports.index = function(req, res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render('./admin/movieIndex',{
			title:'后台列表页',
			movies : movies
		})
	})
}

exports.detail = function(req, res){
	var id = req.params.id;
	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err)
		}
		Comment
			.find({ movie : movie })
			.populate('from', 'name')
			.exec(function(err, comments){
				console.log("comments:")
				console.log(comments)
				res.render('detail',{
					title :'详情页',
					movie : movie,
					comments : comments
				});
			})
	});
}

exports.create = function(req, res){
	res.render('./admin/movieEdit',
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
}

exports.createAdd = function(req, res){
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
}

exports.update = function(req, res){
	var id = req.params.id;
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			res.render('./admin/movieEdit',{
				title : '后台更新页',
				movie : movie
			})
		})
	}
}

exports.del = function(req, res){
	var id = req.body.id;
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
}

exports.score = function(req, res){
	var id = req.body.id,
		score = { score : req.body.score },
		_movie;
	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie, score);
			_movie.save(function(err, movie){
				if(err) {
					console.log(err)
				}
				res.json({ status : 1 });
			});
		})
	}
}