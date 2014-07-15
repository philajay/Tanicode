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
	articleName : ko.observable(),
	seriesTOC : ko.observableArray(),

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

	showSpriteTemplate : function(){
		
		if( tc.koModel.previewCurrentSlide() && tc.koModel.previewCurrentSlide().data.TYPE == "SPRITE" ){
			return true;
		} 
		return false;
	},

}

//articleMetaData
//slidesMetaData
//firstSlide

$( document ).ready(function(){
	//initView();
	initSeries();
	attachHandlers();
	//goToWatch();
	goToArticle();
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
		var slide = tcp.SeriesManager.currentArticleId
		slide = slide + "_" + tcp.UIManager.manager.index;
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
	});
	$('#myModal').on('shown.bs.modal', function() {
        window.setTimeout(function(){
        	$('#myModal').modal('hide');
        }, 1000)
    })
}


function initSeries(){
	tc.koModel.articleName(window.title);
	_.each(toc.articles, function(d, i){
		tc.koModel.seriesTOC.push(d);
	});

	ko.applyBindings(tc.koModel);

	_.each(toc.articles, function(d, i){
		$('#toc_' + d.id).on('click', {id : d.id, index: i}, function(event){
			tcp.SeriesManager.currentIndex = i;
			tcp.SeriesManager.getArticleSlides(event.data.id)
			//trans.scaleDown(;
			//trans.scaleDown({to: "nav_toc", elem: "toc", show: "nav_toc", callback:scaleDown});
			animationManager.ArticleSelected();
		})

	})

}

function scaleUp(){
	$('#main_ui').hide();
	$('#toc').show();
	trans.scaleUp({to: "nav_toc", elem: "toc", show: "nav_toc", callback:reInitTOC});
}


/*

function reInitTOC(){
	_.each(toc.articles, function(d, i){
		$('#toc_' + d.id).on('click', {id : d.id, index: i}, function(event){
			tcp.SeriesManager.currentIndex = i;
			tcp.SeriesManager.getArticleSlides(event.data.id)
			//trans.scaleDown(;
			trans.scaleDown({to: "nav_toc", elem: "toc", show: "nav_toc", callback:scaleDown});
		})

	})
}

function scaleDown(){
	$('#toc').hide();
	$('#main_ui').show();
}
function getArticle(){
			//event.data['elem'] = $(this);
	$('#toc').hide();
	var id = $(this).attr("id").replace("toc_", "");
	id = parseInt(id, 10);
	tcp.SeriesManager.getNextArticleSlides(id)

}
*/
var done = false;
function initView(){
	tcp.StandardUIManager.reinit();
	window.sj = $.parseJSON(metaData)
	artDetailsData = $.parseJSON( sj['articleMetaData'] );
	//window.slides =  sj['slidesMetaData'] ;
	window.slides =  $.parseJSON($.parseJSON( window.savedSlides ));
	//window.firstSlide = sj['firstSlide'] ;
	tc.articleDetails.initFromJSON(artDetailsData);
	tc.koModel.previewSlides = ko.observableArray();
	tc.articleDetailsHolder.data = tc.articleDetails;
	tc.koModel.articleDetails = tc.articleDetailsHolder;
    /*if( !done ){
    	ko.applyBindings(tc.koModel);
    	done = true;
	}*/
    tc.preview();

}

tc.preview = function(){
   tc.overlayInitArticle();
   $('#myModal').modal('show');
   //$('#jstreejstreeHolder').css('height', $('#editor').css('height'));
}


tc.overlayInitArticle = function(){
	dataSlides = []
	$('#pv_dd').html('')
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
		aid = tcp.SeriesManager.currentArticleId;
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

function goToArticle(){
	var slide = getParameterByName("slide");
	if(slide){
		var params = slide.split("_")
		articleID = parseInt(params, 10);
		tcp.SeriesManager.getArticleSlides(articleID, goToWatch)
	}
}

function goToWatch(){
	$('#toc').hide();
	$('#main_ui').show();

	navbarManager.showNav();
	var slide = getParameterByName("slide")
	if(slide){
		var params = slide.split("_")
		islide = parseInt(params[1], 10);
		tcp.UIManager.moveTo(islide);
		if( params.length > 2 ){
			iwatch = parseInt(params[2], 10);
			tcp.UIManager.manager.goToWatch(iwatch);
		}
	}
}
