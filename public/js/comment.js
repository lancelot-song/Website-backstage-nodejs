/* 评论 */
$(function(){
	$("#commentForm").submit(function(){
		var $this = $(this),
			$list = $("#commentList");
		$.ajax({
			type : "POST",
			url  : $this.attr("action"),
			data : $this.serialize()
		})
		.done(function(data){
			var str = '<li class="media">\
              				<div class="pull-left"><img style="width:30px;height:30px" class="media-object"></div>\
          					<div class="media-body">\
            					<h4 class="media-heading">'+$this.attr("data-username")+'</h4>\
            					<p>'+data.content+'</p>\
          					</div>\
            			</li>';

			$list
				.append(str)
				.animate({
					"scrollTop" : $list[0].scrollHeight
				},200);

			$this.find("textarea").val("");
		})
		return false;
	})
})