/* 登录注册逻辑 */
$("#signin,#goSignin,#signup,#goSignup").submit(function(){
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