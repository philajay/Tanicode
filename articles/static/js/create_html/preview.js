
tcp = {};



tcp.offset = function(){
	return $('#preview_board').offset();
};
tcp.tcEditor = {
	defaultStyle : '',

	init : function(){
		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/monokai");
		editor.getSession().setMode("ace/mode/html");
		editor.setReadOnly(true);
		this.defaultStyle	= editor.container.style.fontFamily;	
		this.aceEditor = editor;
	},
	
	setValue : function(s){
		this.aceEditor.setValue(s, 1);
	},
	
	getValue : function(){
		return this.aceEditor.getValue();
	},
	
	resetLang : function(s){

	},

	setTextMode : function(){
		editor = this.aceEditor ;
		editor.container.style.fontFamily = "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace";
	    editor.setShowPrintMargin(false);
        editor.setBehavioursEnabled(false);
        editor.renderer.setShowGutter(false);
        editor.session.setUseWrapMode(true);

	},

	setCodeMode : function(){
		editor = this.aceEditor ;
		editor.container.style.fontFamily = this.defaultStyle;
	    editor.setShowPrintMargin(true);
        editor.setBehavioursEnabled(true);
        editor.renderer.setShowGutter(true);
        editor.session.setUseWrapMode(false);

	},

}




tcp.Slide = function(data, uid){
	this.data = data;
	this.uid = uid;
	tc.koModel.previewSlides.push(this);
	this.index = 0;

	this.syncUI = function(){
		this.index = 0;
		tcp.UIManager.imageWatchDiv.hide();
		tc.koModel.previewWatch(null);	
		this.syncUIDeferred();
		//this.setsyncUIDeferredHandlers();
		//tc.cacheManager.getSlideData(tcp.UIManager.currentSlide, tc.UIManager.syncUIDeferred, null);
		//this.syncUIDeferred();
	};
	
	this.syncUIDeferred = function(){
		tc.koModel.previewCurrentSlide( this )
		
		if(this.data.TYPE != "IMAGE")
			{
				//tc.tcEditor.resetLang(this.data.TYPE);
				tcp.tcEditor.setValue(this.data.text)
				tcp.tcEditor.setCodeMode();
				//tcp.tcEditor.aceEditor.session.setUseWrapMode(false);
				if(this.data.TYPE == "CODE"){
					if ( this.data.watches.length > 0){ 
						w = this.data.watches[this.index];
						this.showCodeWatch(w)
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
		}
		tc.koModel.previewWatch(w);
		$('#preview_watch').html(w.text());
	};
	
	this.showImageWatch = function(){
		if( w.attached ){
			w = tcp.UIManager.currentSlide.data.watches[tcp.UIManager.currentSlide.index];
			xoffset = parseInt(w.rect.x.replace('px', ''), 10)
			xoffset = xoffset + tcp.offset().left
			x = xoffset + 'px'
			yoffset = parseInt(w.rect.y.replace('px', ''), 10)
			yoffset = yoffset + tcp.offset().top
			y = yoffset + 'px'
			
			tcp.UIManager.imageWatchDiv.css({
				"left": x,
				"top": y,
				"width": w.rect.width,
				"height": w.rect.height,
			});	
			tcp.UIManager.imageWatchDiv.show();
		}
		else{
			tcp.UIManager.imageWatchDiv.hide();	
		}
		tc.koModel.previewWatch(w);
	};

	this.next = function(){
		if(this.data.TYPE == "TEXT"){
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
	}
	
	this.show = function(){
	};
	
	this.syncData = function(){
	};

	this.hide = function(){
	};
	
	this.changeSlide = function(){
		tcp.UIManager.changeTextSlide(this)
	};
	
}

tcp.UIManager = {
	currentSlide : null,
	idToIndexMap : {},
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
	attachEvents : function(){
		$(document).on('tc.events.changeSlide_create', $.proxy(tcp.UIManager.changeTextSlide_preview, tcp.UIManager));
		$(document).on('tc.events.imageWatchDefferred', $.proxy(tcp.UIManager.imageWatchDeffered, tcp.UIManager));
		//markNodeAsSelected
		$(document).on('tc.events.markNodeAsSelected', $.proxy(tcp.UIManager.markNodeAsSelected, tcp.UIManager));
	},
	detachEvents : function(){
		$(document).off('tc.events.changeSlide_create');
		$(document).off('tc.events.imageWatchDefferred');
		$(document).off('tc.events.markNodeAsSelected');
	},
	imageWatchDeffered : function(e, s){
		tc.UIManager.imageWatchDefferedEx(s);
	},	
	setsyncUIDeferredHandlers : function(t){
			tc.getSlideDataEventBinder.currentSlide = t;
			tc.getSlideDataEventBinder.postProcessing = function(){
				var l = tc.koModel.slides().length;
				for(var i = 0; i < l; i++){
					c = tc.koModel.slides()[i];
					if( c.data.uid == tcp.UIManager.currentSlide.uid){
						c.data = tcp.UIManager.currentSlide.data;
						break;
					}
				}
				tcp.UIManager.currentSlide.syncUIDeferred();
			};
			tc.getSlideDataEventBinder.postJsonPopulation = function(obj){
				tc.getSlideDataEventBinder.currentSlide.data = obj.copyTo;
			};
			tc.getSlideDataEventBinder.currentSlideSyncUI = function(){
				
			};

			tc.getSlideDataEventBinder.imageSlidePostProcessing = tc.UIManager.imageWatchDeffered;
			/*tc.getSlideDataEventBinder.customfunc = function(){

			};*/
		},

	changeTextSlide : function(t){
		tcp.UIManager.setsyncUIDeferredHandlers(t);
		tc.cacheManager.getSlideData(t , tc.UIManager.syncUIDeferred, null);

		//$(document).trigger('tc.events.changeSlide_create', t);
	},
	changeTextSlide_preview : function(e, t){
		if( this.currentSlide ){
			this.currentSlide.hide();
		}
		this.currentSlide = t;
		$('#pv_dd_a').html(t.data.name() + '<b class="caret"></b>')
		this.currentSlide.syncUI();
		this.currentSlide.show();
		$(document).trigger('tc.events.markNodeAsSelected');
	},
	moveTo : function(i){
		this.index = i;
		tcp.UIManager.changeTextSlide(tc.koModel.previewSlides()[this.index])
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
		tcp.UIManager.changeTextSlide(tc.koModel.previewSlides()[this.index])
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
		tcp.UIManager.changeTextSlide(tc.koModel.previewSlides()[this.index])
		
	},

	markNodeAsSelected : function(){
		//tcp.jstree.select_node( tcp.UIManager.currentSlide.data.uid );
	},
}

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
	tcp.UIManager.imageWatchDiv.hide();
}

tcp.overlayInit = function(){
	//rawData = $.parseJSON(tcp.previewData['slidesJSON']);
	tc.koModel.previewSlides = ko.observableArray();
	rawData = tc.koModel.slides();
	$('#pv_dd').html('');
	for(var i = 0; i <rawData.length; i++){
		o = rawData[i].data;
		tcp.UIManager.idToIndexMap[o.uid] = i;
		//tcp.slide constructor will add this slide to 
		//previewSlides as side effect.
		//At this given point tcpslide and tcslide has same data object
		//However if we are 
		//1) in edit
		//2) slide x was not populated in normal screen
		//3) user switches to preview and slide x is selected
		//4) now when data will be populated after ajax new data object 
		// is created and set to slide.. NOW DATA OBJECT WILL NOT BE SAME IN TCP AND TC SLIDES..
		slide = new tcp.Slide(o, o.uid);
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
	//tcp.previewTree.init(rawData);
	//tcp.jstree.init();
	//ko.applyBindings(tcp.vm);
}



tcp.InitUI = {
	init : function(){
		h = $( window ).height();
		h = h - 46 - 46 - 10;
		h = h + 'px'
		$('#editor').css('height', h);
		$('#overlay_watch').css('height', h);
	}
	
}

