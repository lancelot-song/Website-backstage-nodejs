$(function(){

	//用户注册逻辑
	$("#signup").submit(function(){
		var $this = $(this);
		$.ajax({
			type : "POST",
			url  : $this.attr("action"),
			data : $this.serialize()
		})
		.done(function(data){
			if(data.status){
				window.location.href = data.url;
			}else{
				console.log(data.info)
			}
		})
		return false;
	});

	//用户登录逻辑
	$("#signin").submit(function(){
		var $this = $(this);
		$.ajax({
			type : "POST",
			url  : $this.attr("action"),
			data : $this.serialize()
		})
		.done(function(data){
			if(data.status){
				console.log("用户名密码正确");
			}else{
				console.log(data.info)
			}
		})
		return false;
	});

})