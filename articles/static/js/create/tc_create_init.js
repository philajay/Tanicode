

	var NewSlideOption = function(name){
		this.name = name;
		this.setNewSlideName = function(){
			tc.UIManager.addNewSlide(this.name);
		}
	}



	tc.onNameNextClick = function(){
	    tc.koModel.slideSectionInitialized(true);
	}

	tc.adjustUI = {
	    editorHeight : '',
	    adjustHeight : function(){
	        h = $( window ).height();
			h = h - 46 - 46 - 10;
			h1 = h + 'px'
	        //$('#editor').css('height', h1);
	        tc.adjustUI.editorHeight = h;
	        $('.tc_adjust_ui').css('height', h1);
	    },
	}


	tc.selectOptions = function(n,d){
		this.name = n,
		this.data = d
	}


	tc.koModel = {
	    newSlideOptions : ko.observableArray([
			new NewSlideOption("Text Slide"),
			new NewSlideOption("Code Slide"),
			new NewSlideOption("Image Slide"),
			new NewSlideOption("Sprite Slide"),
		    ]),
	    
	    //It is later overridden in document ready function.
	    articleDetails : tc.articleDetails,
	    slideSectionInitialized : ko.observable(false),
	    slides :  ko.observableArray(),
		currentSlide : ko.observable(),
		previewCurrentSlide : ko.observable(),
		

		watch : ko.observable(),
		previewWatch : ko.observable(),
		helpTemplateID : ko.observable('help_empty'),
		showHelpTemplate : function(){
		    ret = tc.koModel.helpTemplateID();
		    return ret;
		}.bind(tc.KoModel),
		
		showTemplate : function(s){
	    	return this.showTemplateInternal(this.currentSlide(), s)
		},
		
		showPreviewTemplate : function(s){
		    return this.showTemplateInternal( tc.koModel.previewCurrentSlide() ,s)
		},
		
		showTemplateInternal : function(slide, s){
			if( slide ){
				var t = slide.data.TYPE
				arr = new String(s).split("|");
				for(var i = 0; i < arr.length; i++){
					if (arr[i] == t )
						return  true;
				}
			}
			return false
		},
		
		showSpriteTemplate : function(){
			
			if( tc.koModel.currentSlide() && tc.koModel.currentSlide().data.TYPE == "SPRITE" ){
				return true;
			} 
			return false;
		},

		showWatchTemplate : function(){
	        if( tc.koModel.watch()){
	            return true;
	        }
	        return false;
		},
		
		showPreviewWatchTemplate : function(){
	        if( tc.koModel.previewWatch()){
	            return true;
	        }
	        else if( tc.koModel.previewCurrentSlide() && tc.koModel.previewCurrentSlide().data.type == "SPRITE" ){
	        	return true;
	        }
	        return false;
		},

		deleteWatch : function(){
		    tc.koModel.watch().delete();
		},
		
		codeSlides : function(){
			ret = ko.observableArray();
			ko.utils.arrayForEach(tc.koModel.slides(), function(s) {
				if( s.data.TYPE == "CODE" ){
					if ( s == tc.koModel.currentSlide())
					{
					
					}
					else{
						t = new tc.selectOptions(s.data.name,s.data)
						ret.push(t)
					}
				}
			});
			
			return ret
		},

		imageSlides : function(){
			ret = ko.observableArray();
			ko.utils.arrayForEach(tc.koModel.slides(), function(s) {
				if( s.data.TYPE == "IMAGE" ){
					if ( s == tc.koModel.currentSlide())
					{
					
					}
					else{
						t = new tc.selectOptions(s.data.name,s.data)
						ret.push(t)
					}
				}
			});
			
			return ret
		},

		previewSlides : null,
		showWatchesForCodeSlide : function(){
			if( tc.koModel.currentSlide().data.TYPE == "CODE" 
				&& tc.koModel.currentSlide().data.watches 
				&&  tc.koModel.currentSlide().data.watches.length > 0)
			{
				return true;
			}

			return false;
		},

		watchesForCodeSlide : function(){
			ret = ko.observableArray();
			if( tc.koModel.currentSlide().data.TYPE == "CODE" 
				&& tc.koModel.currentSlide().data.watches 
				&&  tc.koModel.currentSlide().data.watches.length > 0)
			{
				_.each(
					tc.koModel.currentSlide().data.watches, 
					function(w, i){
							t = new tc.selectOptions((w.lineNumber + 1),w)
							ret.push(t)
					}
				);
			}
			return ret;
		},

		codeSlideForTemplate : ko.observable(),
		watchForCodeSlide : ko.observable(),
		imageSlideForTemplate : ko.observable(),
		
	}

	tc.koModel.codeSlideForTemplate.subscribe(function(newValue) {
	    if(newValue){
			tc.koModel.currentSlide().setText( newValue.data.text);
		}
		
	});

	tc.koModel.watchForCodeSlide.subscribe(function(newValue) {
		if(newValue){
			window.setTimeout(function(){
					tc.codeEditor.aceEditor.gotoLine(newValue.data.lineNumber + 1)
				}, 10);
			tc.koModel.watch( newValue.data)
		}
	});


	tc.koModel.imageSlideForTemplate.subscribe(function(newValue) {
	    if(newValue){
			tc.koModel.currentSlide().data.src( newValue.data.src());
		}
		
	});

	tc.koModel.slideSectionInitialized.subscribe(function(newValue) {
	    /*if(newValue){
			//tc.createJSTree();
		}*/
		//
		$('#bs_navbar').css('visibility', 'visible')
		$('#tc_tree_container').show();
		tc.UIManager.addNewSlide("Text Slide");
		tc.koModel.articleDetails.data.showNextButton(false)
		tc.koModel.helpTemplateID('select_slide');
	});



	tc.board = {
		box : null,
		initialized : false,
		init : function(){
			if(this.initialized )
				return
			
			this.initialized = true;
			

			
			$('#board').drag('start',function(e,d) {
				event = e
				opos = [event.pageX, event.pageY];
				
				elem = document.createElement('div');
				
				tc.board.box = $(elem).css({border:'1px solid black'});
					
					
				tc.board.box.css({
					"z-index": 100,
					"position": "absolute",
					"left": event.clientX,
					"top": event.clientY,
					"width": 0,
					"height": 0,
				  "opacity" : .5,
				});	
				
				document.body.appendChild(elem);
			})

			$('#board').drag('drag',function(e,d) {
				event = e
				var x1 = opos[0], y1 = opos[1], x2 = event.pageX, y2 = event.pageY;
					if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
					if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }
					tc.board.box.css({left: x1, top: y1, width: x2-x1, height: y2-y1});
			})


			$('#board').drag('end',function(e,d) {
				//tc.board.offset = $('#board').offset();
				tc.board.box.css({ border: '1px solid white', background: 'orange', padding: '0.5em' })
				tc.UIManager.currentSlide.data.addWatch(tc.board.box);
			})
		},

		'offset' : function() {
				return  $('#board').offset();
		},

	}







	tc.tcEditor = function(type, div, theme, mode){
	    this.initialized = false;
	    this.div = div;
	    this.type = type;
	    this.theme = theme;
	    this.mode = mode;
		this.init = function(){
	        if( this.initialized ){
	            return;
	        }
			var editor = ace.edit(this.div);
			//editor.setTheme("ace/theme/monokai");
			editor.setTheme(this.theme);
			//editor.getSession().setMode("ace/mode/html");
			editor.getSession().setMode(this.mode);
			this.aceEditor = editor;
	        if( this.type == "CODE" ){
			    this.aceEditor.on("guttermousedown",this.setWatch);
	    		this.aceEditor.on("change",this.documentChanged);
			}
			else if(this.type == "TEXT"){
			    editor.container.style.fontFamily = "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace";
			    editor.setShowPrintMargin(false);
	            editor.setBehavioursEnabled(false);
	            editor.renderer.setShowGutter(false);
	            editor.session.setUseWrapMode(true);
			}
			this.initialized = true;
		},
		
		this.resetWatches = function(arr){
			tc.codeEditor.aceEditor.session.setBreakpoints(arr);
		};
		
		this.documentChanged = function(event){
			editor = tc.codeEditor.aceEditor;
			var delta = event.data;
			var range = delta.range;
			var len, firstRow, f1;

			if (delta.action == "insertText") {
				len = range.end.row - range.start.row;
				firstRow = range.start.column == 0? range.start.row: range.start.row + 1;
			} else if (delta.action == "insertLines") {
				len = range.end.row - range.start.row;
				firstRow = range.start.row;
			} else if (delta.action == "removeText") {
				len = range.start.row - range.end.row;
				firstRow = range.start.row;
			} else if (delta.action == "removeLines") {
				len = range.start.row - range.end.row;
				firstRow = range.start.row;
			}
			
			var breakpoints = editor.session.getBreakpoints();
			var newBreakpoints = [];
			
			var changed = false;
			if (len > 0) {
				for( var index in breakpoints ) {
					var idx = parseInt(index);
					var n = idx;
					if( idx < firstRow ) {
						newBreakpoints.push(idx);
					}
					else {
						changed = true;
						newBreakpoints.push(idx+len);
						//tc.UIManager.currentSlide.data.resetWatch({old:idx, new:idx+len});
					}
				}
			} else if (len < 0) {
				for( var index in breakpoints ) {
					var idx = parseInt(index);
					n = idx;
					if( idx < firstRow ) {
						newBreakpoints.push(idx);
					}
					else if( (index < firstRow-len) && !newBreakpoints[firstRow]) {
						newBreakpoints.push(firstRow);
						n = firstRow
						changed = true;
					}
					else {
						newBreakpoints.push(len+idx);
						n = len+idx
						changed = true;
					}
					
					//tc.UIManager.currentSlide.data.resetWatch({old:idx, new:n});
				}
			}
			
			if( changed ) editor.session.setBreakpoints(newBreakpoints);
		};
		
		this.setWatch = function(e){
			editor = tc.codeEditor.aceEditor;
			var target = e.domEvent.target; 
			if (target.className.indexOf("ace_gutter-cell") == -1) 
				return; 
			if (!editor.isFocused()) 
				return; 
			if (e.clientX > 25 + target.getBoundingClientRect().left) 
				return; 

			var row = e.getDocumentPosition().row 
			e.editor.session.setBreakpoint(row);
			tc.UIManager.currentSlide.data.addWatch(row);
			e.stop() 
		};
		
		this.redraw = function(){
			this.aceEditor.resize() 
			this.aceEditor.renderer.updateFull() 
		};
		
		this.setValue = function(s){
			this.aceEditor.setValue(s, 1);
		};
		
		this.getValue = function(){
			return this.aceEditor.getValue();
		};
		
		this.resetLang = function(s){
			/*if( s == "TEXT" ){
				this.aceEditor.getSession().setMode("ace/mode/html");
			}
			else if( s== "CODE" ){
				this.aceEditor.getSession().setMode("ace/mode/javascript");
			}*/
		};
		
		this.clearAllWatches = function(){
			tc.codeEditor.aceEditor.session.setBreakpoints(new Array());
		};
	}

	tc.baseSlide = function(){
	    this.syncUI = function(){};
	    this.show = function(){};
	    this.syncData = function(){};
	    this.hide = function(){};
	    this.setText = function(text){};
	}

	
	tc.articleDetails = {
	    'TYPE' : 'METADATA',
	    'name' : ko.observable(''),
	    'tags' : ko.observable(''),
	    'zist' : ko.observable(''),
	    'initialSeed' : 0,
	    'syncUI' : function(){},
	    'show' : function(){
	        setTimeout(
	            function(){
	                $('#name').focus();
	            },
	            1000
	        );
	    },
	    'syncData' : function(){},
	    'hide' : function(){},
	    'setText' : function(text){},
	    'changeSlide' : function(){
			tc.UIManager.changeSlide(tc.koModel.articleDetails)
		},
		'showNextButton' : ko.observable(true),
		'prepopulate' : function(n,t,z,s){
			this.name(n);
			this.tags(t);
			this.zist(z);
			this.initialSeed = s
		}
	}

	//tc.articleDetails.prototype = new tc.baseSlide();
	//tc.articleDetails.prototype.constructor = tc.articleDetails;




	tc.textEditor = new tc.tcEditor('TEXT', 'text_editor', "ace/theme/monokai", "ace/mode/html");
	tc.TextSlide = function(){
		this.TYPE = "TEXT",
		this.name = ko.observable('New Text Slide');
		this.text = '';
		this.syncUI = function(){
		    if( tc.createTextEditor == null ){
	                tc.createTextEditor = createTextEditor();
	        }
	        tc.createTextEditor();
	        tc.textEditor.setValue(this.text)
	        //tc.textEditor.aceEditor.focus();
	        tc.koModel.helpTemplateID('help_text_slide');
		};
		this.syncData = function(){
	        this.text = tc.textEditor.getValue()
		};

		this.cloneFrom = function(d){
			this.name( d.name );
			this.text = d.text;
			this.uid = d.uid;
		};

	}
	tc.TextSlide.prototype = new tc.baseSlide();
	tc.TextSlide.prototype.constructor = tc.TextSlide;

	tc.SpriteSlide = function(){
		this.TYPE = "SPRITE",
		this.name = ko.observable('New Sprite Slide');
		this.src = ko.observable();
		this.height = ko.observable('');
		this.text = ko.observable(''),
		this.syncUI = function(){
		};

		this.syncData = function(){
		};

		this.cloneFrom = function(d){
			this.name( d.name );
			this.src ( d.src );
			this.height ( d.height );
			this.text ( d.text );
		};

	}
	tc.SpriteSlide.prototype = new tc.baseSlide();
	tc.SpriteSlide.prototype.constructor = tc.SpriteSlide;


	tc.ImageSlide = function(){
		this.TYPE = "IMAGE",
		this.name = ko.observable('Name for the new Image Slide');
		this.src = ko.observable();
		this.watches = new Array();

		this.cloneFrom = function(d){
			this.name( d.name );
			this.src( d.src );
			this.uid = d.uid;
			if( d.watches ){
				_.each(d.watches, function(elem, i){
					w = new tc.ImageWatch();
					w.cloneFrom(elem);
					this.watches.push(w);
				}, this)
			}
		};


		this.addWatch = function(div){
			rect = tc.UIManager.currentSlide.data.getRectFromDiv(div)
			w = this.getWatch(div).w;
			if(  w == null ){
				w = new tc.ImageWatch();
				w.rect = {x: rect.x , y:rect.y , width: rect.width, height: rect.height};
				w.setDiv( div );
				this.watches.push(w);
			}
			tc.koModel.watch(w);

		};
		this.getRectFromDiv = function(div){
			o = { x : div.css('left'), y : div.css('top'), width : div.css('width'), height : div.css('height') }
			xoffset = parseInt(o.x.replace('px', ''), 10)
			xoffset = xoffset - tc.board.offset().left
			o.x = xoffset + 'px'
			yoffset = parseInt(o.y.replace('px', ''), 10)
			yoffset = yoffset - tc.board.offset().top
			o.y = yoffset + 'px'

			return o
		};
		this.getWatch = function(div){
			rect = tc.UIManager.currentSlide.data.getRectFromDiv(div)
			o = null;
			var i =0; 
			for(;i < this.watches.length; i++){
				if(this.watches[i].rect.x == rect.x &&  
					this.watches[i].rect.y == rect.y &&
					this.watches[i].rect.width == rect.width &&
					this.watches[i].rect.height == rect.height 
				
				){
					o = this.watches[i];
				}
			}
			
			return { w : o }
		};
		this.deleteWatch = function(w){
			var i =0; 
			for(;i < this.watches.length; i++){
				if(this.watches[i] == w)
				{
					this.watches[i].getDiv().hide();
					break;
				}
			}
			
			this.watches.splice(i, 1)
			tc.koModel.watch(null);
		};
		
		this.clearAllWatches = function(){
			var i =0; 
			for(;i < this.watches.length; i++){
				this.watches[i].getDiv().hide();
			}
		};
		
		
		this.syncUI = function(){
		    tc.board.init();
		    tc.koModel.helpTemplateID('help_image_slide');
		    if ( this.watches.length > 0){ 
				for(var i = 0; i < this.watches.length; i++){
					w = this.watches[i];
					if( w.queued ){
						w.queued(w);
						w.queued = null;
					}
					window.setTimeout(function(){
						w.getDiv().show();
					}, 10);

					
				}
			}

		};
		
		this.syncData = function(){
		    this.clearAllWatches();
		};
		
		this.hide = function(){
		    tc.koModel.watch(null);
		};
	}
	tc.ImageSlide.prototype = new tc.baseSlide();
	tc.ImageSlide.prototype.constructor = tc.ImageSlide;


	var divDict = {
	}

	tc.ImageWatch = function(){
		this.rect = {};
		this.div = null;
		this.guid = null;
		this.uid = tc.getUID();
		this.getDiv = function(){
			return divDict[this.guid];
		};
		this.text = ko.observable('Explain code here');
		this.attached = ko.observable(true);
		this.setDiv = function(d){
			//this.div = d;
			this.guid = guid()
			divDict[this.guid] = d
			d.data("watch", this);
			d.on('click' , function(){
				d = $(this)
				a = d.data('watch')
				tc.koModel.watch(a);
			});
		};
		this.delete = function(){
			tc.UIManager.currentSlide.data.deleteWatch(this);
		};

		this.cloneFrom = function(w){
			//var temp = new tc.ImageWatch();
			temp = this;
			this.rect = w.rect;
			this.uid = w.uid;
			temp.queued = function(temp){
				w = temp;
				elem = document.createElement('div');
				xoffset = parseInt(w.rect.x.replace('px', ''), 10)
				xoffset = xoffset + tc.board.offset().left
				xoffset = xoffset + 'px'
				yoffset = parseInt(w.rect.y.replace('px', ''), 10)
				yoffset = yoffset + tc.board.offset().top
				yoffset = yoffset + 'px'

				$(elem).css({border: '1px solid white', background: 'orange', padding: '0.5em'});
				$(elem).css({
						"z-index": 100,
						"position": "absolute",
						"left": xoffset,
						"top": yoffset,
						"width": 0,
						"height": 0,
						"opacity" : .5,
					});	
				$(elem).css('width', w.rect.width);
				$(elem).css('height', w.rect.height);
				document.body.appendChild(elem);
				$(elem).hide();
				temp.setDiv( $(elem) );
			}
			temp.text(  w.text );
		}
	}

	tc.codeEditor = new tc.tcEditor('CODE', 'code_editor', "ace/theme/monokai", "ace/mode/html");
	tc.CodeSlide = function(){
		this.TYPE = "CODE",
		this.name = ko.observable('Name of the new code slide.');
		this.text = '';
		this.watches = new Array();

		this.cloneFrom = function(d){
			this.name( d.name );
			this.text =  d.text;
			this.uid = d.uid;
			if( d.watches ){
				_.each(d.watches, function(elem, i){
					w = new tc.CodeWatch();
					w.cloneFrom(elem);
					this.watches.push(w);
				}, this)
			}
		};


		this.addWatch = function(lineNumber){
			w = this.getWatch(lineNumber).w;
			if(  w == null ){
				w = new tc.CodeWatch();
				w.lineNumber = lineNumber;
				this.watches.push(w);
			}
			tc.codeEditor.aceEditor.gotoLine(w.lineNumber + 1)
			tc.koModel.watch(w);

		};
		this.getWatch = function(l){
			b = false;
			o = null;
			var i =0; 
			for(;i < this.watches.length; i++){
				if(this.watches[i].lineNumber == l ){
					b =  true;
					o = this.watches[i];
				}
			}
			
			return { w : o }
		};
		this.deleteWatch = function(w){
			var i =0; 
			for(;i < this.watches.length; i++){
				if(this.watches[i].lineNumber == w.lineNumber ){
					break;
				}
			}
			
			this.watches.splice(i, 1)
			
			arr = new Array();
			var i =0; 
			for(;i < this.watches.length; i++){
				arr.push( this.watches[i].lineNumber )
			}
			
			tc.codeEditor.resetWatches(arr);
			tc.koModel.watch(null);
		}
		
		this.resetWatch = function(o){
			d = this.getWatch(o.old)
			d.w.lineNumber = o.new;
		}
		
		this.syncUI = function(){
		    if( tc.createCodeEditor == null ){
	                tc.createCodeEditor = createCodeEditor();
	        }
	        tc.createCodeEditor();
	        tc.codeEditor.setValue(this.text)
	        tc.codeEditor.aceEditor.focus();
	        tc.koModel.helpTemplateID('help_code_slide');
	        if ( this.watches.length > 0){ 
				var arr = new Array();
				for(var i = 0; i < this.watches.length; i++){
					arr[i] = this.watches[i].lineNumber;
				}
				tc.codeEditor.resetWatches(arr);
				w = this.watches[0];
				//This might be called from the async code also
				//so need to put it to the queue for later processing.
				window.setTimeout(function(){
					tc.codeEditor.aceEditor.gotoLine(w.lineNumber + 1)
				}, 10);
				
				tc.koModel.watch(w)
			}
		};
		
		this.syncData = function(){
		    this.text = tc.codeEditor.getValue();
		    tc.codeEditor.clearAllWatches();
		};
		
		this.hide = function(){
		    tc.koModel.watch(null);
		};
		
		this.setText = function(text){
	        this.text = text;
			tc.codeEditor.setValue(this.text)
		};

	}
	tc.CodeSlide.prototype = new tc.baseSlide();
	tc.CodeSlide.prototype.constructor = tc.CodeSlide;

	tc.CodeWatch = function(){
		this.uid = tc.getUID();
		this.lineNumber = 0;
		this.text = ko.observable('Explain code here');
		this.attached = ko.observable(true);
		this.cloneFrom = function(w){
			this.uid = w.uid;
			this.lineNumber = w.lineNumber;
			this.text( w.text )
		};
		this.delete = function(){
			tc.UIManager.currentSlide.data.deleteWatch(this);
		}
	}


	function getUniqueId(){
	    var id = tc.articleDetails.initialSeed;
	    id++;
	    return function(){
	        id++;
	        tc.articleDetails.initialSeed = id;
	        return id;
	    } 
	}
	//In case of edit we are calling it again in the edit_ready
	//because there we will change the initialSeed
	tc.getUID = getUniqueId();


	tc.Slide = function(data){
		this.data = data;

		if( ! this.data['uid'] ){
			this.data['uid'] = tc.getUID();
		}
		//tc.vm.slides.push(this);
		//tc.vm.currentSlide( this )
		this.setText = function(text){
	        this.data.setText(text);
		};
		//Set the text into editor
		this.syncUI = function(){
			this.data.syncUI();
		};
		
		this.show = function(){
		};
		
		this.syncData = function(){
			this.data.syncData();
		};
		this.hide = function(){
	        this.data.hide();
		};
		
		
		this.deleteSlide = function(){
			var res = confirm("Are you sure you want to delete this slide?");
			
			if( ! res ) return;

			tc.koModel.slides.remove(this);
			if( tc.koModel.slides().length > 0 ){
				//also set the focus to the first node of the tree.
				tc.UIManager.changeSlide(tc.koModel.slides()[0])
			}
			else{
				tc.koModel.currentSlide( null )
			}
			//$('#scrollbar1').tinyscrollbar_update();
		};
		
		this.changeSlide = function(){
			tc.UIManager.changeSlide(this)
		};
		
		this.addCodeWatch = function(){
			
		};

		this.moveSlideUp = function(){
			i = tc.koModel.slides.indexOf(this);
			tc.koModel.slides.remove(this);
			i--;
			tc.koModel.slides.splice(i,0,this);
		};
		this.moveSlidedown = function(){
			i = tc.koModel.slides.indexOf(this);
			tc.koModel.slides.remove(this);
			i++;
			tc.koModel.slides.splice(i,0,this);
		};
		/*
					i = tc.koModel.slides.indexOf(this);
			i--;
			tc.koModel.slides.splice(i,0,this);

		*/
	}

	tc.getSlideDataEventBinder = {
		//slide on which we are working.
		'currentSlide' : null,
		//fired at the end of the sync processing
		'postProcessing' : null,
		//fired when data has been populated from json data
		//if data was already there this wont be fired.
		'postJsonPopulation' : null,
		//fired when image data has been populated.
		'imageSlidePostProcessing' : null,
		//custom function ... can be hooked anyplace
		'customfunc' : null,
	}

	tc.EventMediator = {
		'init' : function(){

		}
	}

	tc.UIManager = {
		currentSlide : null,
		that : this,
		newSlide : null,
		attachEvents : function(){
			$(document).on('tc.events.init_create', $.proxy(tc.UIManager.init_create, tc.UIManager));
			$(document).on('tc.events.changeSlide_create', $.proxy(tc.UIManager.changeSlide_create, tc.UIManager));
			$(document).on('tc.events.changeSlide_edit', $.proxy(tc.UIManager.changeSlide_edit, tc.UIManager));
			$(document).on('tc.events.changeSlide_preview', $.proxy(tcp.UIManager.changeTextSlide, tcp.UIManager));
			$(document).on('tc.events.setAndChangeSlide_create', $.proxy(tc.UIManager.setAndChangeSlide_create, tc.UIManager));
			$(document).on('tc.events.addNewSlide_create', $.proxy(tc.UIManager.addNewSlide_create, tc.UIManager));
			$(document).on('tc.events.syncLastSlide_create', $.proxy(tc.UIManager.syncLastSlide_create, tc.UIManager));
			$(document).on('tc.events.imageWatchDefferred', $.proxy(tc.UIManager.imageWatchDeffered, tc.UIManager));
		},
		detachEvents : function(){
			$(document).off('tc.events.init_create');
			$(document).off('tc.events.changeSlide_create');
			$(document).off('tc.events.changeSlide_edit');
			$(document).off('tc.events.changeSlide_preview');
			$(document).off('tc.events.setAndChangeSlide_create');
			$(document).off('tc.events.addNewSlide_create');
			$(document).off('tc.events.syncLastSlide_create');
			$(document).off('tc.events.imageWatchDefferred');
		},
		init : function(t){
			$(document).trigger('tc.events.init_create', t);
		},
		changeSlide : function(s){
			if( tc.mode == "edit" ){
				if( tc.screen == "preview"){
					$(document).trigger('tc.events.changeSlide_preview', s);
				}
				else{
					$(document).trigger('tc.events.changeSlide_edit', s);
				}
			}
			else
			{
				$(document).trigger('tc.events.changeSlide_create', s);
			}
		},
		setAndChangeSlide : function(s){
			$(document).trigger('tc.events.setAndChangeSlide_create', s);
		},
	    addNewSlide : function(s){
	    	$(document).trigger('tc.events.addNewSlide_create', s);
	    },	
	    syncLastSlide : function(){
	    	$(document).trigger('tc.events.syncLastSlide_create', s);
	    },


		init_create : function(e, t){
			this.setAndChangeSlide(t);
		},
		changeSlide_create : function(e, s){
			if(s){
			    this.newSlide = s;
			}
			if ( this.currentSlide ){
				this.currentSlide.syncData()
				this.currentSlide.hide()
			}
			this.currentSlide = this.newSlide;
			tc.koModel.currentSlide(this.currentSlide);
			this.currentSlide.syncUI();
			this.currentSlide.show();
			//tc.UIManager.setsyncUIDeferredHandlers();
			//tc.cacheManager.getSlideData(this.currentSlide, this.syncUIDeferred, null);

		},
		changeSlide_edit : function(e, s){
			if( ! s){
				s = this.newSlide;
			}
			tc.UIManager.setsyncUIDeferredHandlers(s);
			tc.cacheManager.getSlideData(s, this.syncUIDeferred, null);
		},
		
		setAndChangeSlide_create : function(e, s){
		    this.newSlide = s;
		    this.changeSlide();
		},
	    addNewSlide_create : function(e, s){
	        if( s == "Text Slide" ){
				tc.UIManager.newSlide = new tc.Slide(new tc.TextSlide());
			}
			else if( s == "Code Slide" ){
				tc.UIManager.newSlide = new tc.Slide(new tc.CodeSlide());
			}
			else if( s == "Image Slide" ){
				tc.UIManager.newSlide = new tc.Slide(new tc.ImageSlide());
			}
			else if( s == "Sprite Slide"){
				tc.UIManager.newSlide = new tc.Slide(new tc.SpriteSlide());
			}
			tc.cacheManager.addSlide(tc.UIManager.newSlide, new tc.state(true, false))
			tc.koModel.slides.push(tc.UIManager.newSlide);
	        tc.UIManager.changeSlide();
			//$('#scrollbar1').tinyscrollbar_update();

	    },
	    syncLastSlide_create : function(e){
	        this.currentSlide.syncData();
	    },

	    'setsyncUIDeferredHandlers' : function(s){
			tc.getSlideDataEventBinder.currentSlide = s;
			tc.getSlideDataEventBinder.postJsonPopulation = function(obj){
				tc.getSlideDataEventBinder.currentSlide.data = obj.copyTo;
			};
			tc.getSlideDataEventBinder.currentSlideSyncUI = function(){
				tc.getSlideDataEventBinder.currentSlide.data.syncUI();
			};

			tc.getSlideDataEventBinder.imageSlidePostProcessing = tc.UIManager.imageWatchDeffered;
		},
		'syncUIDeferred' : function(res){
			
			if(res){

				d = $.parseJSON(res)
				o = d.data;
				//tc.UIManager.currentSlide.data = d.data;
				//tc.cc(tc.UIManager.currentSlide.data)
				var copyTo = null;
				if(o.TYPE == "CODE"){
					//copyTo = new tc.CodeSlide();
					_.each(o.watches, function(w,i){
						var temp = new tc.CodeWatch();
						temp.lineNumber = w.lineNumber;
						temp.text(  w.text );
						temp.attached( w.attached )
						tc.getSlideDataEventBinder.currentSlide.data.watches.push(temp);
						//copyTo.watches.push(temp);
					})
				} else if(o.TYPE == "IMAGE" ){
					copyTo = new tc.ImageSlide();
					tc.getSlideDataEventBinder.currentSlide.data.src(o.src);
					copyTo.src(o.src)
					//In order to caculate the position of the watch divs we need the 
					//offset of the board div. However at this point since koModel has 
					//not applied .. borad div is invisible. We need to the move the 
					//calculation of the watch divs to some later point.
					//window.setTimeout(tc.getSlideDataEventBinder.imageSlidePostProcessing, 10, o, s)

					//$(document).trigger('tc.events.imageWatchDefferred', o);
				} else if(o.TYPE == "TEXT" ){
					copyTo = new tc.TextSlide();
				}
				tc.getSlideDataEventBinder.currentSlide.data.name(o.name);
				tc.getSlideDataEventBinder.currentSlide.data.text = o.text;
				tc.getSlideDataEventBinder.currentSlide.data.uid = o.uid;
				tc.cacheManager[d.data.uid].state.syncedWithServer = true;

				//tc.getSlideDataEventBinder.postJsonPopulation({'copyTo': copyTo});

				if(o.TYPE == "IMAGE" ){
					$(document).trigger('tc.events.imageWatchDefferred', o);
				}
			}
			
			$(document).trigger('tc.events.changeSlide_create', tc.getSlideDataEventBinder.currentSlide);
			//tc.getSlideDataEventBinder.postProcessing();
			//myApp.hidePleaseWait();
		},
		'imageWatchDeffered' : function(e,o){
			window.setTimeout(tc.UIManager.imageWatchDefferedEx, 10, o, s)
		},
		'imageWatchDefferedEx' : function(o){
			_.each(o.watches, function(w,i){
				var temp = new tc.ImageWatch();
				temp.rect = w.rect;
				temp.queued = function(temp){
					w = temp;
					elem = document.createElement('div');
					xoffset = parseInt(w.rect.x.replace('px', ''), 10)
					xoffset = xoffset + tc.board.offset().left
					xoffset = xoffset + 'px'
					yoffset = parseInt(w.rect.y.replace('px', ''), 10)
					yoffset = yoffset + tc.board.offset().top
					yoffset = yoffset + 'px'

					$(elem).css({border: '1px solid white', background: 'orange', padding: '0.5em'});
					$(elem).css({
							"z-index": 100,
							"position": "absolute",
							"left": xoffset,
							"top": yoffset,
							"width": 0,
							"height": 0,
							"opacity" : .5,
						});	
					//$(elem).css({'left': w.rect.left, 'top': w.rect.top, 'width': w.rect.width, 'heightc.cacheManager.getSlideDatat': w.rect.height});
					//var x = $('#board').offset()
					//o = { x : div.css('left'), y : div.css('top'), width : div.css('width'), height : div.css('height') }
					
					//$(elem).css('left', xoffset);
					//$(elem).css('top', yoffset);
					$(elem).css('width', w.rect.width);
					$(elem).css('height', w.rect.height);
					document.body.appendChild(elem);
					$(elem).hide();
					temp.setDiv( $(elem) );
				}
				//temp.div = $(elem);
				temp.text(  w.text );
				temp.attached( w.attached )
				tc.getSlideDataEventBinder.currentSlide.data.watches.push(temp);
			})	
			//current slide has already been updated. calling
			////tc.koModel.currentSlide(tc.UIManager.currentSlide); again wont make any change
			//forced to call the syncui directly.
			tc.getSlideDataEventBinder.currentSlideSyncUI();
		},

	}

	function createCodeEditor(){
	    init = false;
	    $('#code_editor').css('height',(tc.adjustUI.editorHeight - 20) + 'px')
	    return function(){
	        tc.codeEditor.init();
	        
	    }
	};

	tc.createCodeEditor = null;


	function createTextEditor(){
	    init = false;
	    $('#text_editor').css('height',(tc.adjustUI.editorHeight - 10) + 'px')
	    return function(){
	        tc.textEditor.init();
	        
	    }
	};

	tc.createTextEditor = null;
	function createUploader(){            
		var uploader = new qq.FileUploader({
			element: document.getElementById('file-uploader'),
			action: 'ajaxupload',
			debug: true,
			onComplete: function( id, fileName, responseJSON ) {
				url = "/static/images/" + responseJSON.success
				tc.UIManager.currentSlide.data.src(url)
			},
			onAllComplete: function( uploads ) {
			// uploads is an array of maps
			// the maps look like this: { file: FileObject, response: JSONServerResponse }
			//alert( "All complete!" ) ;
			}
		});           
	}

	/*
	$( document ).ready(function(){
		temp = new tc.Slide(new tc.TextSlide());
		ko.applyBindings(tc.vm)
		tc.UIManager.init(temp);
		$('#scrollbar1').tinyscrollbar();
		createUploader()
	});
	*/
	
	tc.saveArticleData = function(){
		this.getMetaData = function(){
			obj = {};
			obj['articleMetaData'] = ko.toJSON(tc.articleDetails);
			/*obj['slidesMetaData'] = [];
			ko.utils.arrayForEach(tc.koModel.slides(), function(s) {
            	o = {};
            	o['name'] = s.data.name();
            	o['uid'] = s.data.uid;
            	o['TYPE'] = s.data.TYPE;
            	obj['slidesMetaData'].push(o)
        	});
        	obj['firstSlide'] = ko.toJS( tc.koModel.slides()[0].data )*/
			return obj
		};

		this.getSlides = function(){
			return ko.toJSON(tc.koModel.slides);
		};

		this.getSlidesHTML = function(){
			html = ""			
			ko.utils.arrayForEach(tc.koModel.slides(), function(s) {
				//html += '<div id="' + s.data.uid + '">' 
				if( s.data.TYPE == "TEXT"){
					html += s.data.text;
				}
				else if(s.data.TYPE == "SPRITE"){

				}
				else
				{
					for(var i = 0;i < s.data.watches.length; i++){
						//html += '<p>' + s.data.watches[i].text() + '</p>'
						html += s.data.watches[i].text()
					}
				}
				//html += "</div>"
        	});

        	return html;
		}

		this.getData = function(){
			if(tc.mode == "edit"){
				obj = {'metaData' : this.getMetaData(), 'slides': this.getSlides(), 'html': this.getSlidesHTML(), 'aid': window.aid}
				return JSON.stringify(obj)
			}
			else{
				obj = {'metaData' : this.getMetaData(), 'slides': this.getSlides(), 'html': this.getSlidesHTML()}
				if( window.aid){
					obj["aid"] = window.aid
				}
				return JSON.stringify(obj)
			}
		};
	}

	function saveArticle(){
		tc.UIManager.syncLastSlide();
		o = new tc.saveArticleData();
		d = o.getData();
		u = "saveSlides";
		if( tc.mode == "edit"){
			u = "updateSlides"
		}
		else if (window.aid){
			u = "/articles/edit/" + window.aid + "/updateSlides"

		}
		$.ajax({
		  type: "POST",
		  url: u,
		  data: {data: d},
		  success: function(result){
				alert("article saved")
				window.aid = $.parseJSON(result).id

		  },
		});
		
		return false;

	}

	/*
	function saveSlides(){
		$.ajax({
		  type: "POST",
		  url: "saveSlides",
		  data: {slides: ko.toJSON(tc.koModel.slides)},
		  success: function(result){
				alert(result)
		  },
		});
		
		return false;
	}
	*/
	tc.initHelpHandlers = function(){
	    $('#name').on('focus', function(){
	        tc.koModel.helpTemplateID('help_name');
	    });
	    $('#tags').on('focus', function(){tc.koModel.helpTemplateID('help_tags')});
	    $('#zist').on('focus', function(){tc.koModel.helpTemplateID('help_zist')});
	}


	$( document ).ready(function(){
	    tc.adjustUI.adjustHeight();
	    setMode();
	    tc.UIManager.attachEvents();
		if(tc.mode == "create"){
	    	create_ready();
	    	postReady()
	    }
	    else
	    {
	    	$.ajax({
				  dataType: "json",
				  url: '/articles/getArticleSlidesAjax?aid=' + window.aid,
				  success: function(res){
				  	//res = $.parseJSON(res)
				  	window.metadata = $.parseJSON(res['metadata'])
				    window.savedSlides = $.parseJSON(res['slides'])
				    edit_ready();
				}
			});
	    	//edit_ready()
	    }
	})

	function postReady(){
		ko.applyBindings(tc.koModel);
		tc.initHelpHandlers();
	    createUploader();

	    $('#preview_close').click(function(){
	    	tcp.UIManager.detachEvents();
		  	tc.UIManager.attachEvents();

	    	tcp.close();
	    })
	}

	function setMode(){
		tc.mode = "create"
		if(window.aid){
			tc.mode = "edit";
		}
	}

	function create_ready(){
		tc.koModel.articleDetails  = new tc.Slide(tc.articleDetails);
	    tc.UIManager.setAndChangeSlide(tc.koModel.articleDetails);
	    $('#name').focus();
	}

	tc.copyProperties = ['name', 'uid', 'TYPE']
	function edit_ready(){
		window.sj = $.parseJSON(window.metadata)
		artDetailsData = $.parseJSON( sj['articleMetaData'] );
		window.slides =  $.parseJSON($.parseJSON( window.savedSlides ));
		window.firstSlide = sj['firstSlide'] ;
		tc.articleDetails.prepopulate(artDetailsData.name, artDetailsData.tags, artDetailsData.zist, artDetailsData.initialSeed)
		tc.getUID = getUniqueId();
		tc.koModel.articleDetails  = new tc.Slide(tc.articleDetails);
		dataSlides = []
		//$Seo = $('#seo')
		_.each(window.slides, function(elem, i){
				d = null;
				if( elem.data.TYPE == "TEXT"){
					d = new tc.TextSlide();
				}
				else if( elem.data.TYPE == "CODE"){
					d = new tc.CodeSlide();
				}
				else if( elem.data.TYPE == "IMAGE"){
					d = new tc.ImageSlide();
				}
				else if( elem.data.TYPE == "SPRITE"){
					d = new tc.SpriteSlide();
				}

				d.cloneFrom(elem.data);

				s = new tc.Slide(d);

				tc.koModel.slides().push(s);
				tc.cacheManager.addSlide(s, new tc.state(true, true))
			}
		);
		$('#tc_tree_container').show();
		//tc.UIManager.addNewSlide("Text Slide");
		tc.UIManager.changeSlide(tc.koModel.slides()[0])
		tc.koModel.articleDetails.data.showNextButton(false)
		tc.koModel.helpTemplateID('select_slide');
		$('#bs_navbar').css('visibility', 'visible')
		//window.setTimeout( postReady, 10);
		postReady();
	}


	tc.preview = function(){
	   tc.UIManager.syncLastSlide();
	   //tcp.previewData['slidesJSON'] =  ko.toJSON(tc.koModel.slides);
	   //register preview handlers.
	   tc.UIManager.detachEvents();
	   tcp.UIManager.attachEvents();
	   tcp.overlayInit();
	}


	tc.state = function(i,j){
	this.isNew = i;
	this.syncedWithServer = j;
	}

tc.cacheManager = {
	'addSlide' : function(slide, state){
		this[slide.data.uid] = {
			'state' : state,
			'slide' : slide,
		}
	},

	'getSlideData' : function(s, success, failue){
		
		if( s.data.TYPE == "METADATA"){
						var deferred = $.Deferred();
			deferred.resolve(null,null);
			deferred.done(success);
			return;
		}

		obj = this[s.data.uid]
		if(obj.state.isNew || obj.state.syncedWithServer){
			var deferred = $.Deferred();
			deferred.resolve(null,obj.state);
			deferred.done(tc.UIManager.syncUIDeferred);
		}
		else{
			//myApp.showPleaseWait();
			var post = $.ajax({
				  dataType: "json",
				  url: 'getSlide?uid='+ s.data.uid + "&aid=" + getParameterByName('aid'),
				  success: function(res){/*
				  		d = $.parseJSON(res)
				  		tcp.UIManager.currentSlide.data = d.data
				  */}
			});

			post.done(success)
		}
	}
}



