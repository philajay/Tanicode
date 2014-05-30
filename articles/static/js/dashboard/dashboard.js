series = {
	'visitedMap' : {},
	'visited' : function(target){
		if ( target = '#series'){
			series.visitSeries(target);
		}
	},
	'visitSeries' : function(target){
		if(!series.visitedMap[target]){

			$.ajax({
			      type: "GET",
			      url: "/articles/dashboardGetAllSeries",
			      error: function(data){
			        alert("There was a problem");
			      },
			      success: function(data){
			      	data = $.parseJSON(data)
			      	_.each(data, function(d, i){
			      		$('#' + d.domId).prop('disabled', d.is_published);
			      		//Need to fix the bug.
			      		//window.setTimeout($('#' + d.domId).prop('disabled', d.is_published), 10);
			      		seriesModel.series.push(d)
			      		$('#' + d.domId).on('click', {id : d.id}, function(event){
			      			event.data['elem'] = $(this);

								$.ajax({
									  dataType: "json",
									  url: '/articles/publishSeries?id='+ event.data.id,
									  success: function(d){
									  		alert(d.msgg)
									  		event.data['elem'].prop('disabled', true);
									  		event.data['elem'].prop('checked', true);
									  		
									  }
								})


			      		})
			      	series.visitedMap[target] = data;	
			      	})
			      }
				})





		}
	},
}
/*

/*

*/
seriesModel = {
	series :  ko.observableArray(),
}

ko.applyBindings(seriesModel);

$(document).ready( function(){
		var rows = $('#tb_articles > tbody > tr').length;
		if( rows ){
			$('#articles_start').hide();
		}
		$('#tb_articles > tbody > tr').each( function(i, o){
				var c = $($(o).find('.ar_tb_pub')[0]);
				var id = c.attr("id").replace("id_article_", "");
				c.on('click', {'id': id} ,function(event){
						$.ajax({
							  dataType: "json",
							  url: '/articles/publishArticle?id='+ event.data.id,
							  success: function(d){
							  		alert(d.msgg)
							  		$('#span_article_tr_' + d.id).hide();
							  		$('#id_article_' + d.id).prop('disabled', true);
							  		$('#id_article_' + d.id).prop('checked', true);
							  		
							  }
						});
				})
			}
		)


		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		  var target = $(e.target).attr("href") // activated tab
		  UIManager.changeUI(target);
		  series.visited(target)
		})
	}
);

UIManager = {
	changeUI : function(target){
		if(target == "#series"){
			$("#create_new").attr("href", "/articles/createSeries");
			$("#create_new").html("New Series");
		}
		else if( target == "#articles" ){
			$("#create_new").attr("href", "/articles/create");
			$("#create_new").html("New Article");
		}
	}
}

