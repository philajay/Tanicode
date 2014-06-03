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

	
}

//articleMetaData
//slidesMetaData
//firstSlide

$( document ).ready(function(){
	//initView();
	initSeries();
})

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

