var Comment = require('../models/comment');

exports.save = function(req, res){
	var _comment = req.body.comment,
		comment = new Comment(_comment);
		
	comment.save(function(err, comment){
		if(err){
			console.log(err)
		}
		res.json(comment)
	});
}