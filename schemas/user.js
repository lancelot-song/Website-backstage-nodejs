// 模式： 此文件用于定义数据库字段类型

var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),//引入加密库
	saltRounds = 10;//设置盐的量

var UserSchema = new mongoose.Schema({
	name : {
		unique : true,//唯一数据
		type : String
	},
	password : String,
	meta : {
		createAt : {
			type : Date,
			dafault : Date.now()
		},
		updateAt : {
			type : Date,
			deault : Date.now()
		}
	}
})

//每次存取数据调用此方法
UserSchema.pre('save',function(next){
	var user = this;
	if ( this.isNew ) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(saltRounds, function(err, salt){//调用bcrypt加盐
		if(err) next(err)

		bcrypt.hash(user.password, salt, function(err, hash){ //将密码与盐传入 存储返回的hash
			if(err) next(err);
			user.password = hash;
			next();
		})
	})
})

UserSchema.statics = {
	fetch : function(cb){//取出数据库目前所有数据
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById : function(id, cb){//取出单条数据
		return this
			.findOne({ _id : id})
			.exec(cb)
	}
}
module.exports = UserSchema;