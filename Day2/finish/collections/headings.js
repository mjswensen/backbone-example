define(['backbone', 
	'models/heading'], 
	
	function(Backbone, Heading){

		var Headings = Backbone.Collection.extend({
		  model: Heading,
		  comparator:function(model){
			// A 'sortBy' comparator
			return model.get('order');
		  }
		});

		return Headings;
});