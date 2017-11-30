var moment = require('moment');//格式化时间

var Index = require('../app/controllers/index'),
	User = require('../app/controllers/user'),
	Movie = require('../app/controllers/movie'),
	Comment = require('../app/controllers/comment');

module.exports = function(app){

	app.locals.moment = moment;

	//session读写
	app.use(function(req, res, next){
		res.locals.user = req.session.user;
		next();
	})

	app.get('/', Index.index);

	//movie 用户浏览
	app.get('/movie/:id', Movie.detail);
	app.post('/movie/score', Movie.score);
	app.post('/movie/comment', Comment.save);

	//movie 后台
	app.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.index);
	app.get('/admin/movie/create', User.signinRequired, User.adminRequired, Movie.create);
	app.post('/admin/movie/create/add', User.signinRequired, User.adminRequired, Movie.createAdd );
	app.delete('/admin/movie/del', User.signinRequired, User.adminRequired, Movie.del);

	// user 
	app.get('/signup', User.goSignup);
	app.get('/signin', User.goSignin);
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/user/signout', User.signout);
	app.get('/user/list', User.signinRequired, User.adminRequired, User.list);
	app.delete('/user/del', User.signinRequired, User.adminRequired, User.del);
}