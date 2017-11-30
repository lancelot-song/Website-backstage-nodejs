// 模型： 此文件用于 对定义的模式文件 通过mongoose.model 进行编译
var mongoose = require('mongoose');
var CommentSchema = require('../schemas/comment');
var Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;