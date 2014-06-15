
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
		editor.setReadOnly(true);
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




tcp.Slide = function(data){
	this.data = data;
	tc.koModel.previewSlides.push(this);
	this.index = 0;

	this.syncUI = function(){
		tc.koModel.previewCurrentSlide( this )
		this.index = 0;
		tcp.UIManager.manager.imageWatchDiv.hide();
		tc.koModel.previewWatch(null);
		if(this.data.TYPE != "IMAGE")
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
				}
				else {
					tcp.tcEditor.setTextMode();
					
				}
			}
		else{
				//tcp.offset = $('#preview_board').offset();
				if ( this.data.watches.length > 0){
					w = this.data.watches[this.index];
					window.setTimeout( this.showImageWatch, 10 )
				}
		}
	};

	this.showCodeWatch = function(w){
		if( w.attached ){
			n = w.lineNumber + 1
			tcp.tcEditor.aceEditor.gotoLine(n)
			tcp.tcEditor.aceEditor.scrollToLine(n - 1, true);
			tc.koModel.previewWatch(w);
			tcp.tcEditor.setBreakPoint(n - 1);

			/*window.setTimeout(function(){
					jsPlumb.hide($('.ace_active-line'));
					jsPlumb.connect(
						{ 
						  	source: $('.ace_active-line'), 
						  	target: $("#overlay_watch"), 
						  	anchors:["BottomCenter", "Left"]
						}, stateMachineConnector
					);
				}, 10);
			*/
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
	};

	this.next = function(){
		if(this.data.TYPE == "TEXT"){
			return null;
		}
		temp = this.index + 1
		if(temp >= this.data.watches.length){
			return null;
		}
		
		this.index++
		w = this.data.watches[this.index];
		
		if(this.data.TYPE == "CODE"){
			this.showCodeWatch(w)
		}
		if(this.data.TYPE == "IMAGE"){
			this.showImageWatch(w)
		}
		return {}
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
	
	this.previous = function(){
		if(this.data.TYPE == "TEXT"){
			return null;
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
	};
	
	this.show = function(){
	};
	
	this.syncData = function(){
	};

	this.hide = function(){
		if(this.data.TYPE == "IMAGE"){
			tcp.UIManager.manager.imageWatchDiv.hide();	
			jsPlumb.hide(tcp.UIManager.manager.imageWatchDiv);
		}//jsPlumb.hide($('.ace_active-line'));
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
	/*
		Called whenever we change the article in the series
	*/
	reinit : function(){
		if( this.currentSlide ){
			this.currentSlide.hide();
		}
		this.index = 0;
		this.currentSlide = null;
	},
	changeTextSlide : function(t){
		if( this.currentSlide ){
			this.currentSlide.hide();
		}
		this.currentSlide = t;
		this.changeTextSlideHelper();
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
			tcp.SeriesManager.getNextArticleSlides();
			return;
		}
		this.index++;
		this.changeTextSlide(tc.koModel.previewSlides()[this.index])
	},
	
	goToWatch : function(i){
		this.currentSlide.goToWatch(i)
	},
	previous : function(){
		o = this.currentSlide.previous();
		if ( o ) {
			return
		}
		temp = this.index - 1
		if( temp < 0  ){
			tcp.SeriesManager.getPreviousArticleSlides();
			return;
		}
		this.index--;
		this.changeTextSlide(tc.koModel.previewSlides()[this.index])
	},
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
	goToWatch : function(i){
		this.manager.goToWatch(i)
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
		h = h - 85;
		h = h + 'px'
		$('#editor').css('height', h);
		$('#overlay_watch').css('height', h);
		$('#sl1').slider();
	}
	
}



tcp.SeriesManager = {
	'currentArticleId' : 0,
	'currentIndex' : 0,
	'cache' : {},
	'getArticleSlides' : function(id, cb){
		this.currentArticleId = id;
		if( this.cache[id] ){
			window.metaData = this.cache[id]['metadata'];
			window.savedSlides = this.cache[id]['slides'];
	      	initView();
	      	if(cb){
				cb();	      		
	      	}
		}
		else{
			$.ajax({
					  dataType: "json",
					  url: '/articles/getArticleSlidesAjax?aid=' + id,
					  success: function(res){
					  	//res = $.parseJSON(res)
					  	window.metaData = $.parseJSON(res['metadata'])
					    window.savedSlides = $.parseJSON(res['slides'])
					    tcp.SeriesManager.cache[id] = {};
					    tcp.SeriesManager.cache[id]['metadata'] = window.metaData;
					    tcp.SeriesManager.cache[id]['slides'] = window.savedSlides;
	      				//tcp.StandardUIManager.reinit();
	      				initView();
	      				if(cb){
							cb();	      		
	      				}
					  }
			});
		}
	},
	'getNextArticleSlides' : function(){
		if( (this.currentIndex + 1) >  tc.koModel.seriesTOC().length){
			return;
		}
		this.currentIndex++;
		var v = tc.koModel.seriesTOC()[this.currentIndex];
		this.getArticleSlides(v.id);
	},
	'getPreviousArticleSlides' : function(){
		if( (this.currentIndex - 1) <  0){
			return;
		}
		this.currentIndex--;
		var v = tc.koModel.seriesTOC()[this.currentIndex];
		this.getArticleSlides(v.id);
	}
}



navbarManager = {
	once : false,
	'init' : function(){
		navbarManager.hideNav();
	},
	'hideNav' : function(){
		$('#nav_bar_previous').hide();
		$('#nav_bar_next').hide();
		$('#nav_bar_article_toc').hide();
		$('#popComments').hide();
	},
	'showNav' : function(){
		if( !navbarManager.once ){
			navbarManager.once = true;
		}
		$('#nav_bar_previous').show();
		$('#nav_bar_next').show();
		$('#nav_bar_article_toc').show();
		$('#popComments').show();
	},
	'onShowTOC' : function(){

	},
	'onShowArticle' : function(){

	}
};



(function(obj){
	obj.init();
}(navbarManager));

animationManager = {
	scaledDown : false,
	scaledUp : false,
	ArticleSelected : function (){
		navbarManager.showNav();
		if( !animationManager.scaledDown  ){
			$('#nav_toc').show();
			$('#nav_toc').css('opacity', 0);
			trans.scaleDown({to: "nav_toc", elem: "toc", show: "nav_toc", callback:animationManager.cbScaleDown});
		}
		else{
			animationManager.cbScaleDown();		
		}
	},
	cbScaleDown : function(){
		$('#toc').hide();
		$('#main_ui').show();

		animationManager.scaledDown = true;
	},
	tocSelected : function(){
		if( tcp.UIManager.manager.currentSlide ){
			tcp.UIManager.manager.currentSlide.hide();
		}
		$('#main_ui').hide();
		$('#toc').show();
		if( !animationManager.scaledUp ){
			trans.scaleUp({to: "nav_toc", elem: "toc", show: "nav_toc", callback:animationManager.cbScaleUp});
		}
		navbarManager.hideNav();
	},
	cbScaleUp : function(){
		_.each(toc.articles, function(d, i){
			$('#toc_' + d.id).on('click', {id : d.id, index: i}, function(event){
				tcp.SeriesManager.currentIndex = i;
				tcp.SeriesManager.getArticleSlides(event.data.id);
				animationManager.ArticleSelected();
			})
		})
		$('#toc').css('opacity', 1);
		animationManager.scaledUp = true;
	},
}



trans = {
  toc : null,
  height: null,
  width: null,
  'scaleDown' : function(anim ){
      var o = $('#' + anim.to);
      var w = 100;
      var l = o.offset().left + 15;
      var t = o.offset().bottom - 30;
      var elem = $("#" + anim.elem)
      this.toc = elem.html();
      this.height = $(document).height();
      this.width = elem.width();
      elem.transition({ x: l }, 500,'ease', function(){
          elem.animate({ width: w }, 600, "linear", function(){
              html = '<div class="triangle-isosceles top">Table of Content</div>'
              elem.html(html);
              //$("#main_ui").addClass('transit-box');
              elem.animate({height: 50 }, 600, "linear", function(){
                  elem.transition({y: t - 70 }, 500,'ease', function(){
                    $('#' + anim.show).animate({opacity: 1 }, 300, "linear", function(){
                      elem.animate({opacity: 0 }, 300, "linear" , function(){
                      	if(anim.callback){
                      		anim.callback();
                      	}
                      });
                    });
                  });            
                }
            );
          });
      });
  },

  'scaleUp' : function(anim){
      var o = $('#' + anim.to);
      var elem = $("#" + anim.elem)
      elem.animate({opacity: 1 }, 300, "linear", function(){
          $('#' + anim.show).animate({opacity: 1 }, 3, "linear", function(){
              elem.transition({y: 0 }, 500,'ease', function(){
                  elem.html(trans.toc);
                  /**/
                  elem.animate({width: trans.width }, 600, "linear", function(){
                         elem.animate({height: trans.height }, 600, "linear", function(){
                                elem.transition({ x: 0 }, 500,'ease', function(){
                                  try{
                                        if(anim.callback){
                      						anim.callback();
                      					};
                                  }catch(e){alert(e)}
                                });

                          });
                  });
              });
          });
      })
  },
}