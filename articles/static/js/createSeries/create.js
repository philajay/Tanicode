$(document).ready( function(){
		$('#articles > tbody > tr').each( function(i, o){
				var c = $($(o).find('.ar_tb_pub')[0]);
				var id = c.attr("id").replace("id_article_", "");
				c.on('click', {'id': id} ,function(event){
					obj = articlesMap[event.data.id];
					if ( $(this).prop("checked") ){
						if( !obj['moveSlideUp']  ){
							obj['moveSlideUp'] = moveSlideUp;
							obj['moveSlidedown'] = moveSlidedown;
						}
						model.articles.push(obj)
					}
					else{
						model.articles.remove(obj)
					}
				})
			}
		)

		$("#saveSeries").on('click', function(){
			if( !$('#name').val() ){
				alert("Series name cannot be empty")
				return; 
			}
			if( !$('#tags').val() ){
				alert("Series tags cannot be empty")
				return; 
			}
			if( !$('#zist').val() ){
				alert("Series zist cannot be empty")
				return; 
			}
			if (model.articles().length == 0){
				alert("There should be ateast one article in series.")
				return; 
			}
			save = {};
			save['name'] = $('#name').val(); 
			save['tags'] = $('#tags').val();
			save['zist'] = $('#zist').val();
			save['articles'] = ko.toJSON(model);

			u = '/articles/saveSeries/';
			if(window.sa && window.sa != ''){
				u = '/articles/updateSeries/?aid=' + window.aid
			}
			$.ajax({
			  type: "POST",
			  url: u,
			  data: {data: JSON.stringify(save)},
			  success: function(result){
			  	alert("Series saved. Publish it from dashboard.")
			  },
			});

		})

		if(window.sa && window.sa != ''){
			var temp = $.parseJSON(sa);
			$('#name').val(window.name); 
			$('#tags').val(window.tags);
			$('#zist').val(window.zist);
			var arr = temp['articles']
			_.each(arr, function(d, i){
				id = d.id
				obj = articlesMap[id];
				obj['moveSlideUp'] = moveSlideUp;
				obj['moveSlidedown'] = moveSlidedown;
				model.articles.push(obj)
				$("#id_article_" + id).prop("checked", true)
			})
		}
	}
);


function moveSlideUp(){
	i = model.articles.indexOf(this);
	model.articles.remove(this);
	i--;
	model.articles.splice(i,0,this);
};
function moveSlidedown(){
	i = model.articles.indexOf(this);
	model.articles.remove(this);
	i++;
	model.articles.splice(i,0,this);
};

model = {
	articles :  ko.observableArray(),
}

ko.applyBindings(model);