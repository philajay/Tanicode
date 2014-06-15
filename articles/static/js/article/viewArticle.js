tc.tempVariables = {
	custom : true,
}

tc.articleDetails = {
    'TYPE' : 'METADATA',
    'name' : ko.observable(''),
    'tags' : ko.observable(''),
    'zist' : ko.observable(''),
    'initialSeed' : 0,
    'syncUI' : function(){},
    'show' : function(){
        setTimeOut(
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
	'initFromJSON' : function(j){
		tc.articleDetails.name(j.name);
		tc.articleDetails.tags(j.tags);
		tc.articleDetails.zist(j.zist);

		tc.articleDetails.initialSeed = j.initialSeed;
	}
}

tc.articleDetailsHolder = {
	data : null,
}

tc.koModel = {
    articleDetails : tc.articleDetails,
	previewCurrentSlide : ko.observable(),
	

	previewWatch : ko.observable(),
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
	
	showPreviewWatchTemplate : function(){
        if( tc.koModel.previewWatch()){
            return true;
        }
        return false;
	},

	
}

//articleMetaData
//slidesMetaData
//firstSlide

$( document ).ready(function(){
	window.sj = $.parseJSON(metaData)
	artDetailsData = $.parseJSON( sj['articleMetaData'] );
	//window.slides =  sj['slidesMetaData'] ;
	window.slides =  $.parseJSON($.parseJSON( window.savedSlides ));
	//window.firstSlide = sj['firstSlide'] ;
	tc.articleDetails.initFromJSON(artDetailsData);
	tc.koModel.previewSlides = ko.observableArray();
	tc.articleDetailsHolder.data = tc.articleDetails;
	tc.koModel.articleDetails = tc.articleDetailsHolder;
    ko.applyBindings(tc.koModel);
    tc.preview();
    goToWatch();
    attachHandlers();
})

function attachHandlers(){
	$("#popComments").on('click', function(){
		populateComments();
		$('.comment_outer_div').show();
	});

	$("#close_comments").on('click', function(){
		$('.comment_outer_div').hide();
	});
	$("#signIn").on('click', function(){
		var slide = tcp.UIManager.manager.index;
		var watch = null;
		if(tcp.UIManager.manager.currentSlide.data.TYPE == "CODE" || tcp.UIManager.manager.currentSlide.data.TYPE == "IMAGE"){
			watch = tcp.UIManager.manager.currentSlide.index;
		}
		var href = window.location.pathname + "?slide="  + slide;
		if ( watch  != null){
			href =  href + "_" + watch;
		}
		href = "/login/facebook?next=" + href;
		window.location.href = href
	});

	$('#postComment').on('click', function(){
		comment = $.trim($('#txtComments').val());
		if( comment == ""){
			alert("Comment cannot be empty.")
			return; 
		}

		var wid = tcp.UIManager.manager.currentSlide.data.uid;
		if(tcp.UIManager.manager.currentSlide.data.TYPE == "CODE" || tcp.UIManager.manager.currentSlide.data.TYPE == "IMAGE"){
			if( tcp.UIManager.manager.currentSlide.data.watches && tcp.UIManager.manager.currentSlide.data.watches.length > 0 ){
				wid = tcp.UIManager.manager.currentSlide.data.watches[ tcp.UIManager.manager.currentSlide.index ].uid;
			}
		}

		$.post( "/articles/saveComment", { 'wid': wid, 'aid': aid, 'comment' : comment } , function(d){
			d = $.parseJSON(d)
			if( commentsCache[wid] ){
				commentsCache[wid].push(d);
			}
			else {
				commentsCache[wid] = new Array();	
				commentsCache[wid].push(d);
			}
			populateHTML(commentsCache[wid]);
			$('#txtComments').val('');
		})
	})
}

function goToWatch(){
	var slide = getParameterByName("slide")
	if(slide){
		var params = slide.split("_")
		islide = parseInt(params[0], 10);
		tcp.UIManager.moveTo(islide);
		if( params.length > 1 ){
			iwatch = parseInt(params[1], 10);
			tcp.UIManager.manager.goToWatch(iwatch);
		}
	}
}

tc.preview = function(){
   tc.overlayInitArticle();
   $('#jstreejstreeHolder').css('height', $('#editor').css('height'));
}


tc.overlayInitArticle = function(){
	dataSlides = []

	_.each(window.slides, function(elem, i){
			o =  elem.data;
			slide = new tcp.Slide(o);
			dataSlides.push(slide);

			var elemStr = '<li><a href="#">'+ (i + 1) + '  ' + slide.data.name +'</a></li>'
			$('#pv_dd').append(elemStr)

		}
	);

	tcp.UIManager.index = 0;
	tcp.InitUI.init();
	tcp.UIManager.init(tc.koModel.previewSlides()[0]);
	$('#pv_dd > li' ).each(function(index){
	$(this).find('a').each( function(index2){
			$(this).on('click', function(){
				tcp.UIManager.moveTo(index)
			});
		});
	});
	$('#overlay').show();	
}

