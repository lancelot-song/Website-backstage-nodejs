//电影评分与初始化
var Score = function( $dom ){
	this.config = {
		group : $dom,
		scoreArray : $dom.find(".ui-score-array"),
		scores : $dom.find(".ui-score"),
		scoreTxt : $dom.find(".ui-score-txt"),
		scoreInput : $("#scoreData"),
		scoreDefault : $("#scoreData").val()
	}
	this.init();
}
Score.prototype = {
	init : function(){
		var self = this,
			config = self.config;

		self.setScore( config.scoreDefault, true);

		config.scoreArray.popover({//评分成功后调用弹窗功能
			trigger : "manual"
		});

		config.scores.click(function(){
			var num = $(this).index() + 1;
			self.setScore(num, true);

			//评分请求
			$.ajax({
				type : "POST",
				url : "/movie/score",
				data : {
					id : config.group.attr("data-id"),
					score : config.scoreInput.val()
				}
			})
			.done(function(data){
				if(data.status == 1){
					config.scoreArray.popover("show");
					setTimeout(function(){
						config.scoreArray.popover("hide");
					},3000)
				}
			})
		});

		config.scores.mouseover(function(){
			var num = $(this).index() + 1;
			self.setScore(num);
		});

		config.group.mouseout(function(){
			self.setScore(config.scoreDefault);
		});
		
	},
	setScore : function(num, set){
		var self = this;

		this.config.scores.removeClass("active");

		if(num > 0){
			var scoreTxt = this.config.scores.eq(num-1).attr("data-txt");
			this.config.scores.slice(0, num).addClass("active");
			this.config.scoreTxt.html( scoreTxt );
		}

		if(set){
			self.config.scoreDefault = num;
			self.config.scoreInput.val(num);
		}
	}
}

$(function(){
	new Score( $("#scoreGroup") );
})