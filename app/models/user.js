// 模型： 此文件用于 对定义的模式文件 通过mongoose.model 进行编译
var mongoose = require('mongoose');
var UserSchema = require('../schemas/user');
var User = mongoose.model('User', UserSchema);

module.exports = User;