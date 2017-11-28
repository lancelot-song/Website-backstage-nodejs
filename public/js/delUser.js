$(function(){
	$(".del").click(function(){
		var id = $(this).attr("data-id"),
			tr = $(this).parents("tr");

		$.ajax({//以 id=id || {id:id}传参都可以 app.js以res.body.id获取即可
			type : "DELETE",
			url : "/user/del",
			data : { id : id }
		})
		.done(function(data){
			if(data.status === 1){
				if(tr.length > 0){
					tr.remove();
				}
			}
		})
	})
})