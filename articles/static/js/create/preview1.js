
tcp = {};


var stateMachineConnector = {				
				connector:"StateMachine",
				paintStyle:{lineWidth:3,strokeStyle:"yellow"},
				hoverPaintStyle:{strokeStyle:"yellow"},
				endpoint:"Blank",
				anchor:"Continuous",
				overlays:[ ["PlainArrow", {location:1, width:15, length:12} ]]
			};
			

tcp.previewTree = {
	'dataObj' : null,
	'init' : function(s){
		tcp.previewTree.previewTreeData(s);
	},
	'getData' : function(){
		return tcp.previewTree.dataObj;
	},

	'previewTreeData' : function(slides){
			dataArr = [];
			_.each(slides, function(elem, i){
					dataArr.push({
						'id' : elem.data.uid,
						'text' : tcp.previewTree.getMinText(elem.data.name),
						'data' : {'id':elem.data.uid, 'index' : i, 'd' : elem},
					} )
				}
			)

			dataObj = {
				'text' : tcp.previewTree.getMinText(tc.koModel.articleDetails.data.name()),
				'id' : -1,
				'type' : "root",
				'data' : {'id': -1, 'index': -1},
				"children" : true,
				"children" : dataArr,
			}

			tcp.previewTree.dataObj = dataObj;
			return dataObj;
	},

	'getMinText' : function(s){
		s1 = new String(s);
		if(s1.length > 12){
			return s1.substring(0, 11) + "..."
		}
		else{
			return s;
		}
	} 


}

jsTree_Data = [
  { "id" : "demo_root_1", "text" : "Root 1", "children" : true, "type" : "root", data: {'rainbow':true},
	"children" : ["Child 1", { "id" : "demo_child_1", data: {'rainbow':true},"text" : "Child 2", "children" : [ { "id" : "demo_child_2", data: {'rainbow':true},"text" : "One more", "type" : "file" }] }, "child3"],
  },
]

tcp.jstree = {
	'firstTime' : true,
	init : function(){
			if(!this.firstTime){
				$("#jstree").jstree('destroy');
			}
			this.firstTime = false;
			$("#jstree").jstree({
		 	"core" : {
      				"animation" : 0,
    				"check_callback" : false,
    				'data' : tcp.previewTree.getData(),
    			},
    		"plugins" : ["search",
    			"state", "types", "wholerow"
    		]
		});

		$('#jstree').bind('select_node.jstree', function (e, data) {
			if ( tcp.jstree.internal_trigger)
			{
				tcp.jstree.internal_trigger = false;
				return;
			}

			d = data.node.data;
			if( ! d ){
				return;	
			}

			if( d.index == -1){
				return
			}
			index = tcp.UIManager.idToIndexMap[d.id];
			tcp.UIManager.moveTo(index)
		});
		window.setTimeout(function(){
			//$("#jstree").jstree("refresh");		
			tcp.jstree.select_node(tcp.previewTree.dataObj.children[0].data.id)
		}, 10)
	},

	'internal_trigger' : false,

	'select_node' : function(s){
		tcp.jstree.internal_trigger = true;
		$("#jstree").jstree('deselect_all', true);
		$("#jstree").jstree("open_all");
		$("#jstree").jstree("select_node", '#' + (s));	
	},
}




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
		tcp.UIManager.imageWatchDiv.hide();
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
			tc.koModel.previewWatch(w);
			tcp.tcEditor.setBreakPoint(n - 1);
		}
		$('#preview_watch').html(w.text);
				/*
					source: jsPlumb.makeSource("#jstreeHolder"), 
			  		target: jsPlumb.makeSource('#overlay_watch'), 
				
				window.setTimeout(function(){
						jsPlumb.connect(
						{ 
					  		source: $("#jstreeHolder"), 
					  		target: $("#overlay_watch"), 
						}, stateMachineConnector
					);
				}, 10);
				*/	
		/*jstreeHolder
		window.setTimeout(function(){
			jsPlumb.connect(
				{ 
			  		source: jsPlumb.makeSource($('.ace_active-line')), 
			  		target: jsPlumb.makeSource($('#overlay_watch')), 
				}
			);
		}, 10)*/
	};
	
	this.showImageWatch = function(){
		
		w = tcp.UIManager.currentSlide.data.watches[tcp.UIManager.currentSlide.index];
		if( w.attached ){
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
		tcp.tcEditor.setBreakPoint([])
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
	changeTextSlide : function(t){
		if( this.currentSlide ){
			this.currentSlide.hide();
		}
		this.currentSlide = t;

		if (tcp.UIManager.currentSlide.data.text){
			var deferred = $.Deferred();

			deferred.resolve(null);

			deferred.done(tcp.UIManager.changeTextSlideHelper);
		}
		else{
			var post = $.ajax({
				  dataType: "json",
				  url: 'getSlide?uid='+ tcp.UIManager.currentSlide.data.uid + "&aid=" + getParameterByName('aid'),
				  success: function(res){/*
				  		d = $.parseJSON(res)
				  		tcp.UIManager.currentSlide.data = d.data
				  */}
			});

			post.done(tcp.UIManager.changeTextSlideHelper)
		}
	},

	changeTextSlideHelper : function (res) {
		if( res ){
			d = $.parseJSON(res)
			tcp.UIManager.currentSlide.data = d.data
		}
		$('#pv_dd_a').html(tcp.UIManager.currentSlide.data.name + '<b class="caret"></b>');
		tcp.UIManager.currentSlide.syncUI();
		tcp.UIManager.currentSlide.show();
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
		tcp.jstree.select_node( tcp.UIManager.currentSlide.data.uid );
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
		tcp.jstree.select_node( tcp.UIManager.currentSlide.data.uid );
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
	rawData = $.parseJSON(tcp.previewData['slidesJSON']);
	tc.koModel.previewSlides = ko.observableArray();
	for(var i = 0; i <rawData.length; i++){
		o = rawData[i].data;
		tcp.UIManager.idToIndexMap[o.uid] = i;
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
	//tcp.previewTree.init(rawData);
	//tcp.jstree.init();

}



tcp.InitUI = {
	init : function(){
		h = $( window ).height();
		h = h - 46 - 46 - 10;
		h = h + 'px'
		$('#editor').css('height', h);
		$('#overlay_watch').css('height', h);
		$('#sl1').slider();
	}
	
}





