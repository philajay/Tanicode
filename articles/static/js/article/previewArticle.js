

tcp = {};


var stateMachineConnector = {				
				connector:"StateMachine",
				paintStyle:{lineWidth:3,strokeStyle:"yellow"},
				hoverPaintStyle:{strokeStyle:"yellow"},
				endpoint:"Blank",
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};
			



tcp.offset = function(){
	return $('#preview_board').offset();
};
tcp.tcEditor = {
	defaultStyle : '',

	init : function(){
		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/eclipse");
		editor.getSession().setMode("ace/mode/html");
		//editor.setReadOnly(true);
		this.defaultStyle	= editor.container.style.fontFamily;	
		editor.setFontSize(16);
		this.aceEditor = editor;
		console.log("intialized editor");
	},
	
	setValue : function(s){
		this.aceEditor.setValue(s, 1);
	},
	
	getValue : function(){
		return this.aceEditor.getValue();
	},
	
	resetLang : function(s){

	},

	setBreakPoint : function(lno){
		editor.session.setBreakpoints([lno]);
	},

	setTextMode : function(){
		editor = this.aceEditor ;
		editor.container.style.fontFamily = "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace";
	    editor.setShowPrintMargin(false);
        editor.setBehavioursEnabled(false);
        editor.renderer.setShowGutter(false);
        editor.session.setUseWrapMode(true);
        $('#editor').css('background', '#FFFFA3');
	},

	setCodeMode : function(){
		editor = this.aceEditor ;
		editor.container.style.fontFamily = this.defaultStyle;
	    editor.setShowPrintMargin(true);
        editor.setBehavioursEnabled(true);
        editor.renderer.setShowGutter(true);
        editor.session.setUseWrapMode(false);
        $('#editor').css('background', 'white');
	},
}


tcp.TextSlideHelper = function(html){
	this.index = 0;
	this.html = html;
	this.parsedHTML = $.parseHTML(html);
	this.nodes = new Array();
	this.show = function(i){
		tcp.tcEditor.setTextMode();
		if(this.nodes.length == 0 ){
			tcp.tcEditor.setValue(this.html)
		}
		else{
			var s = ''
			for(var j = i; j >= 0; j--){
				s += this.nodes[j].content + "\n\n";
			}
			var o = this.nodes[i];
			if( o.class == "question" ){
				this.showQuestion(s);		
			}
			else {
				this.showAnswer(s);		
			}
		}
	};
	this.goToLastWatch = function(){
		if( this.nodes.length == 0 ) {
			return null;
		}
		this.index = this.nodes.length;
		return this.previous();
	};
	this.showQuestion = function(o){
		tcp.tcEditor.setValue(o);
		$('#text_img').attr('src', "/static/images/tanituts/why.png");
	};
	this.showAnswer = function(o){
		tcp.tcEditor.setValue(o);
		$('#text_img').attr('src', "/static/images/tanituts/do.png");
	};
	this.next = function(){
		if( this.nodes.length == 0 ) {
			return null;
		}
		this.index++;
		if(this.index >= this.nodes.length){
			return null;
		}
		this.show(this.index)
		return {}
	};
	this.previous = function(){
		if( this.nodes.length == 0 ) {
			return null;
		}
		this.index--;
		if(this.index <= -1){
			return null;
		}
		this.show(this.index)
		return {}
	};
	this.parse = function(){
		var index = 0;
		$.each( this.parsedHTML, function(i, el){
				//if( el.tagName == "p"){
					try{
						cls = $.trim($(el).attr('class'))
						if( cls == "question" || cls == "answer" ){
							tcp.UIManager.manager.currentSlide.textSlideHelper.nodes.push({'class': cls, 'id': index, 'content': $(el).html()})
						}
						index++;
					}
					catch(e){
					}
				}

			//}  
		)
	};

}

tcp.Timer = function(){
	this.init = function(){
		this.curPx = 0;
		this.frameHeight = 400;
		this.spriteHeight = tcp.UIManager.manager.currentSlide.data.height;
		this.paused = false;
		this.timer;
	}
	this.restart = function(){
		this.stop();
		this.reInit();
		this.run();
		$('#sprite_player').attr('src', "/static/images/tanituts/pause.jpeg");
	};
	this.reInit = function(){
		this.curPx = 0;
		this.frameHeight = 400;
		this.spriteHeight = tcp.UIManager.manager.currentSlide.data.height;
		this.paused = false;
		this.timer;
	};
	this.stop = function(){
		if( tcp.SpriteTimerID){
			clearTimeout(tcp.SpriteTimerID);
		}
	};
	this.run = function(){
		console.log("Run called!!!!!")
		this.runEx();
	};
	this.runEx = function(){
		if( tcp.SpriteTimer.paused ){
			tcp.SpriteTimerID = setTimeout(tcp.SpriteTimer.runEx, 3000);
			return;	
		}
		s =  '0px -'+ tcp.SpriteTimer.curPx +'px';
		$('#preview_sprite').css('backgroundPosition',s );
		tcp.SpriteTimer.curPx = tcp.SpriteTimer.curPx + tcp.SpriteTimer.frameHeight;
		if ( tcp.SpriteTimer.curPx >= tcp.SpriteTimer.spriteHeight) {
			tcp.SpriteTimer.reInit();
			return;
		}
		tcp.SpriteTimerID = setTimeout(tcp.SpriteTimer.runEx, 3000)	

	}

	this.play = function(){
		this.paused = false;
	};
	this.pause = function(){
		this.paused = true;
	};
}


tcp.Slide = function(data){
	this.data = data;
	tc.koModel.previewSlides.push(this);
	this.index = 0;
	this.textSlideHelper;

	this.syncUI = function(){
		tc.koModel.previewCurrentSlide( this )
		this.index = 0;
		tcp.UIManager.manager.imageWatchDiv.hide();
		tc.koModel.previewWatch(null);
		if(this.data.TYPE == "TEXT"){
			tcp.tcEditor.setTextMode();
			this.textSlideHelper = new tcp.TextSlideHelper(this.data.text);
			this.textSlideHelper.parse();
			this.textSlideHelper.show(0);
		}
		else if(this.data.TYPE == "CODE" )
			{
				//tc.tcEditor.resetLang(this.data.TYPE);
				tcp.tcEditor.setValue(this.data.text)
				tcp.tcEditor.setCodeMode();
				//tcp.tcEditor.aceEditor.session.setUseWrapMode(false);
				if(this.data.TYPE == "CODE"){
					if ( this.data.watches.length > 0){ 
						w = this.data.watches[this.index];
						this.showCodeWatch(w);
						console.log("show watch called");
						/*window.setTimeout( function(){
							w = tcp.UIManager.manager.currentSlide.data.watches[ tcp.UIManager.manager.currentSlide.index ];
							tcp.UIManager.manager.currentSlide.showCodeWatch(w);
						}, 1000 )*/
						
					}
					else{
						tcp.tcEditor.aceEditor.gotoLine(1)
					}
					tcp.tcEditor.aceEditor.session.setScrollLeft(0);
				}
			}
		else if(this.data.TYPE == "SPRITE"){
			
			window.setTimeout( this.setSpriteImage, 10 )
			//this.showSpriteAnim();
		}
		else{
				//tcp.offset = $('#preview_board').offset();
				if ( this.data.watches.length > 0){
					w = this.data.watches[this.index];
					window.setTimeout( this.showImageWatch, 10 )
				}
		}
	};
	this.setSpriteImage = function(){
		$('#preview_sprite').css('background-image', 'url('+ tc.koModel.previewCurrentSlide().data.src +')')
		if( !tcp.SpriteTimer){
			tcp.SpriteTimer = new tcp.Timer();
		}
		tcp.SpriteTimer.init();
		tcp.SpriteTimer.run();
	};
	this.toggleSprite = function(){
		var v = $('#sprite_player').attr('src');
		if( v == "/static/images/tanituts/pause.jpeg"){
			tcp.SpriteTimer.pause();
			$('#sprite_player').attr('src', "/static/images/tanituts/play.jpeg");
		}
		else{
			tcp.SpriteTimer.play();
			$('#sprite_player').attr('src', "/static/images/tanituts/pause.jpeg");
		}
	};

	this.showCodeWatch = function(w){
		if( w.attached ){
			n = w.lineNumber + 1
			tcp.tcEditor.aceEditor.gotoLine(n)
			tcp.tcEditor.aceEditor.scrollToLine(n - 1, true);
			tc.koModel.previewWatch(w);
			tcp.tcEditor.setBreakPoint(n - 1);
		}
		$('#preview_watch').html(w.text);
	};
	
	this.showImageWatch = function(){
				
		w = tcp.UIManager.manager.currentSlide.data.watches[tcp.UIManager.manager.currentSlide.index];
		if( w.attached ){
			xoffset = parseInt(w.rect.x.replace('px', ''), 10)
			xoffset = xoffset + tcp.offset().left
			x = xoffset + 'px'
			yoffset = parseInt(w.rect.y.replace('px', ''), 10)
			yoffset = yoffset + tcp.offset().top
			y = yoffset + 'px'
			
			tcp.UIManager.manager.imageWatchDiv.css({
				"left": x,
				"top": y,
				"width": w.rect.width,
				"height": w.rect.height,
			});	
			tcp.UIManager.manager.imageWatchDiv.show();

			window.setTimeout(function(){
				jsPlumb.hide(tcp.UIManager.manager.imageWatchDiv);
				jsPlumb.connect(
					{ 
					  	source: tcp.UIManager.manager.imageWatchDiv, 
					  	target: $("#overlay_watch"), 
					  	anchors:["Right", "Left"]
					}, stateMachineConnector
				);
			}, 10);
		}
		else{
			tcp.UIManager.manager.imageWatchDiv.hide();	
		}
		tc.koModel.previewWatch(w);
		$('#preview_watch').html(w.text);
	};

	this.goToWatch = function(i){
		if(this.data.TYPE == "TEXT"){
			return null;
		}
		this.index = i;
		w = this.data.watches[this.index];
		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		return {}
	};

	this.next = function(){
		if(this.data.TYPE == "TEXT"){
			return this.textSlideHelper.next()
		}
		if(this.data.TYPE == "SPRITE"){
			return null;
		}
		temp = this.index + 1
		if(temp >= this.data.watches.length)
			return null;
		this.index++
		w = this.data.watches[this.index];
		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		return {}
	}
	
	this.previous = function(){
		if(this.data.TYPE == "TEXT"){
			return this.textSlideHelper.previous()
		}
		temp = this.index - 1
		if(temp < 0 )
			return null;
		this.index--
		w = this.data.watches[this.index];

		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		return {}
	}

	this.goToLastWatch = function(){
		if(this.data.TYPE == "TEXT"){
			return this.textSlideHelper.goToLastWatch();
		}

		if( ! this.data.watches ){
			return {}
		}

		this.index = this.data.watches.length - 1
		w = this.data.watches[this.index];

		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}

		return {}		
	}
	
	this.show = function(){
	};
	
	this.syncData = function(){
	};

	this.hide = function(){
		if(this.data.TYPE == "IMAGE"){
			jsPlumb.hide(tcp.UIManager.manager.imageWatchDiv);
		}//jsPlumb.hide($('.ace_active-line'));
		if(this.data.TYPE == "SPRITE"){
			tcp.SpriteTimer.stop();
		}

	};
	
	this.changeSlide = function(){
		tcp.tcEditor.setBreakPoint([])
		tcp.UIManager.changeTextSlide(this)
	};
	
}

tcp.StandardUIManager = {
	currentSlide : null,
	//idToIndexMap : {},
	that : this,
	index : 0,
	imageWatchDiv : null,
	init : function(t){
		//this.bindTemplateVisible();
		elem = document.createElement('div');
		this.imageWatchDiv = $(elem)
		this.imageWatchDiv = $(elem).css({border:'1px solid black'});
		this.imageWatchDiv.css({
				"z-index": 100002,
				"position": "absolute",
				"left": 0,
				"top": 0,
				"width": 0,
				"height": 0,
			  "opacity" : .5,
			});	
		this.imageWatchDiv.css({ border: '1px solid black', background: 'red', padding: '0.5em' })
		document.body.appendChild(elem);
		this.imageWatchDiv.hide();
		tcp.tcEditor.init();
		this.changeTextSlide(t);
	},
	changeTextSlide : function(t){
		if( this.currentSlide ){
			this.currentSlide.hide();
		}
		this.currentSlide = t;
		this.changeTextSlideHelper();
		$('#modal_name').html(this.currentSlide.data.name)
		//$('#myModal').modal('show');
		/*
		window.setTimeout(function(){
			$('#myModal').modal('hide');
		}, 10)*/
	},
	changeTextSlideHelper : function (res) {
		if( res ){
			d = $.parseJSON(res)
			this.currentSlide.data = d.data
		}
		$('#pv_dd_a').html(this.currentSlide.data.name + '<b class="caret"></b>');
		this.currentSlide.syncUI();
		this.currentSlide.show();
	},
	moveTo : function(i){
		this.index = i;
		this.changeTextSlide(tc.koModel.previewSlides()[this.index])
	},
	next : function(){
		o = this.currentSlide.next();
		if ( o ) {
			return
		}
		temp = this.index + 1
		if( temp >= tc.koModel.previewSlides().length ){
			return
		}
		this.index++;
		this.changeTextSlide(tc.koModel.previewSlides()[this.index])
	},
	
	previous : function(){
		o = this.currentSlide.previous();
		if ( o ) {
			return
		}
		temp = this.index - 1
		if( temp < 0  ){
			return
		}
		this.index--;
		this.changeTextSlide(tc.koModel.previewSlides()[this.index])
		this.currentSlide.goToLastWatch();
	},

	goToWatch : function(i){
		this.currentSlide.goToWatch(i)
	}
}

tcp.UIManager = {
	manager : null,
	register : function( manager ){
		this.manager = manager;
	},
	init : function(t){
		this.manager.init(t);
	},
	changeTextSlide : function(t){
		this.manager.changeTextSlide(t);
	},

	/*
	changeTextSlideHelper : function (res) {
		self.manager.changeTextSlideHelper();	
	},
	*/
	moveTo : function(i){
		this.manager.moveTo(i);
	},
	next : function(){
		this.manager.next();
	},
	
	previous : function(){
		this.manager.previous();
	},
}


tcp.UIManager.register( tcp.StandardUIManager );
/*
	this data must be set before we can call init of 
	preview
*/
tcp.previewData = {
	'tocJSON' : null,
	'slidesJSON' : null
};



tcp.close = function(){
	$('#overlay').hide();
	tcp.UIManager.manager.imageWatchDiv.hide();
}

tcp.overlayInit = function(){
	rawData = $.parseJSON(tcp.previewData['slidesJSON']);
	tc.koModel.previewSlides = ko.observableArray();
	for(var i = 0; i <rawData.length; i++){
		o = rawData[i].data;
		//tcp.UIManager.idToIndexMap[o.uid] = i;
		slide = new tcp.Slide(o);

		var elemStr = '<li><a href="#">'+ (i + 1) + '  ' + slide.data.name() +'</a></li>'
		$('#pv_dd').append(elemStr)

	}
		$('#pv_dd > li' ).each(function(index){
		$(this).find('a').each( function(index2){
				
				$(this).on('click', function(){
					tcp.UIManager.moveTo(index)
				});
		});
	});

	tcp.UIManager.index = 0;
	tcp.InitUI.init();
	tcp.UIManager.init(tc.koModel.previewSlides()[0]);
	$('#overlay').show();	
}



tcp.InitUI = {
	init : function(){
		h = $( window ).height();
		h = h - 80;
		//h = h / 2;
		h = h + 'px'
		$('#editor').css('height', h);
		$('#overlay_watch').css('height', h);
		$('#sl1').slider();
	}
	
}

commentsCache = {}
function populateComments(){
	$(".comment_comments").html();
	var wid = tcp.UIManager.manager.currentSlide.data.uid;
	if(tcp.UIManager.manager.currentSlide.data.TYPE == "CODE" || tcp.UIManager.manager.currentSlide.data.TYPE == "IMAGE"){
		if( tcp.UIManager.manager.currentSlide.data.watches  && tcp.UIManager.manager.currentSlide.data.watches.length > 0){
			wid = tcp.UIManager.manager.currentSlide.data.watches[ tcp.UIManager.manager.currentSlide.index ].uid;
		}
	}

	if ( commentsCache[wid] ){
		populateHTML(commentsCache[wid]);
	}
	else {
		getComments(aid, wid);
	}
}

function populateHTML(l){
	html = ""
	_.each(l, function(d,i){
		s = "<h2 class='comment_h2'><span class='comment_username'>" + d.user + "</span><span class='comment_date'>" + d.date + "</span></h2>"
		s = s + "<div class='comment_comment'>" + d.comment + "</div>";
		html += s;
	})
	$(".comment_comments").html(html);	
}

function getComments(a, w){
	var post = $.ajax({
		  dataType: "json",
		  url: '/articles/getComments?aid='+ a + "&wid=" + w,
		  success: function(res){
		  		var ls = res['comments'];
		  		commentsCache[w] = ls;
		  		populateHTML(ls);
		  }
	});
}

