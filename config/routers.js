var moment = require('moment');//格式化时间

var Index = require('../app/controllers/index'),
	User = require('../app/controllers/user'),
	Movie = require('../app/controllers/movie');

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

	//movie 后台
	app.get('/admin/movie', Movie.index);
	app.get('/admin/movie/create', Movie.create);
	app.post('/admin/movie/create/add', Movie.createAdd );
	app.get('/admin/movie/update/:id', Movie.update);
	app.delete('/admin/movie/del', Movie.del);

	// user 
	app.post('/user/signup', User.signup);
	app.post('/user/signin', User.signin);
	app.get('/user/signout', User.signout);
	app.get('/user/list', User.list);
	app.delete('/user/del', User.del);
}