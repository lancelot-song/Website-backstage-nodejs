/*
*	LSZH封装的工具们
*/

//电影打分
var LszhScore = function( $dom ){
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
LszhScore.prototype = {
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

//首页焦点滚动
var LszhSlider = function($slider){
	var config = this.config = {
		$el : $slider,
		$li : $slider.find("li"),
		$scroll : $slider.find(".ui-slider-scroll"),
		maxLen : 0,
		maxWidth : 0,
		isTranslate : false,
		switching : false,
		currentIndex : 0
	}

	//复制第一个到最后一个 存储 li & li.length
	var $firstLi = config.$li.eq(0).clone();
		config.$scroll.append($firstLi);

		config.$li = $slider.find("li");
		config.maxLen = config.$li.length;

	this.init();
}

LszhSlider.prototype = {
    init : function(){

    	var self = this,
    		config = self.config,
    		maxWidth = 0;

	    config.$li.eq(0).addClass("current");
    	config.$li.each(function(){
    		maxWidth += $(this).width();
    	});
    	config.$scroll.css({
    		width : maxWidth + "px"
    	});

        self.isTranslate();
        self.cssTranslateEnd();
        self.bind();
    },

    bind : function(){

    	var self = this,
    		config = self.config;
    	var btnNext = document.createElement("a"),
    		btnPrev = document.createElement("a");

    	btnNext.href = "javascript:;";
    	btnNext.id = "lszhSliderNext";
    	btnPrev.href = "javascript:;";
    	btnPrev.id = "lszhSliderPrev";

    	config.$el.append(btnNext).append(btnPrev);


    	$(btnNext).click(function(){
    		self.next();
    	});
    	$(btnPrev).click(function(){
    		self.prev();
    	});

    },

    isTranslate : function(){
        var self = this,
        	css3 = {
				'transition':'transitionend',
				'OTransition':'oTransitionEnd',
				'MozTransition':'transitionend',
				'WebkitTransition':'webkitTransitionEnd'
			},
            style = document.getElementsByTagName("body")[0].style;
        for(var i in css3){
        	if( style[i] !== undefined ){
        		self.config.$scroll.addClass("ui-translate");
                self.config.isTranslate = css3[i];
                return false;
        	}
        }
    },


    prev : function(){
    	var self = this,
    		config = self.config;

    	if(config.switching) return false;

    	if( config.currentIndex > 0 ){
    		config.currentIndex--;
    		self.switch();
    	}else{
    		var currentIndex = config.maxLen-1,
    			setLeft = (currentIndex * config.$li.width())


	    	if(config.isTranslate){

	    		config.$scroll
	    			.removeClass("ui-translate")
	    			.css({
		    			transform : "translate3d( "+ -setLeft +"px, 0px, 0px)"
		    		});

	    		setTimeout(function(){
				    config.$scroll.addClass("ui-translate");
		    		config.currentIndex = currentIndex - 1;
		    		self.switch();
	    		},0);

		    }
	    	else{
	    		config.$scroll.css({
	    			left : -setLeft
	    		})
	    		config.currentIndex = currentIndex - 1;
	    		self.switch();
	    	}
    	}
    	config.switching = true;
    },

    next : function(){
    	var self = this,
    		config = self.config,
    		length = config.$li.length;
    	if(config.switching) return false;
    	if( config.currentIndex < length ){
    		config.switching = true;
    		config.currentIndex++;
    		self.switch();
    	}
    },

    switch : function(){
    	var self = this,
    		config = self.config,
    		current = config.currentIndex,
    		length = config.$li.length,
    		setLeft = ( config.$li.width() * current );

    	if(config.isTranslate){
    		config.$scroll.css({
    			transform : "translate3d( "+ -setLeft +"px, 0px, 0px)"
    		});
    		/* 此处的 self.switchEnd() 在 cssTranslateEnd 方法中监听调用 这里不做配置 */
    	}
    	else{
	    	config.$scroll.animate({
	    		left : -setLeft
	    	},function(){
	    		self.switchEnd();
	    	});
    	}
    },

    switchEnd : function(){
    	var config = this.config,
    		current = config.currentIndex,
    		len = config.$li.length;

		if( current === (len-1) ){
    		if(config.isTranslate){

    			config.$scroll
	    			.removeClass("ui-translate")
	    			.css({
			        	transform: "translate3d( 0px, 0px, 0px)"
			    	})
			    setTimeout(function(){
				    config.$scroll.addClass("ui-translate");
				},0)
		    		
    		}
    		else{
		    	config.$scroll.css({
		    		left : 0
		    	});
    		}

			config.currentIndex = current = 0;
		}
		config.$li.removeClass("current").eq(current).addClass("current");
    	config.switching = false;
    },

    cssTranslateEnd : function(){
    	var self = this,
    		config = self.config;

    	config.$scroll[0].addEventListener(config.isTranslate, function(){
    		self.switchEnd();
    	},false)

    }
}