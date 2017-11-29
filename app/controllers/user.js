var User = require('../models/user.js');//引入User数据库模型

exports.goSignup = function(req, res){
	res.render('signup',{
		title :'用户注册'
	});
}

exports.goSignin = function(req, res){
	res.render('signin',{
		title :'用户登录'
	});
}

exports.signup = function(req, res){
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
					url : '/user/list'
				})
			});
		}
	})
}

exports.signin = function(req, res){
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
				req.session.user = user;
				return res.json({
					status : 1,
					url : "/"
				});
			}
			else{
				return res.json({
					status : 0,
					info : "账号或密码错误"
				})
			}
		});
	});
}

exports.signout = function(req, res){
	req.session.user = undefined;
	res.redirect('/');
}

exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err) console.log(err);
		res.render('userlist',{
			title :'注册用户列表',
			users : users
		});
	})
}

exports.del = function(req, res){
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
}

exports.signinRequired = function(req, res, next){
	var user = req.session.user;

	if(!user){
		return res.redirect('/signin')
	}

	next();
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user;

	if(user.role === undefined || user.role < 10){
		return res.redirect('/')
	}

	next();
}