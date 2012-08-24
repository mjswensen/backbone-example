define(['backbone', 
	'models/category'], 
	
	function(Backbone, Category){

		var Categories = Backbone.Collection.extend({
		  model: Category,
		  comparator:function(model1, model2){
			// A 'sort' comparator
			if(model1.get('order') === model2.get('order')) {
				return 0;
			} else {
				return (model1.get('order') < model2.get('order')) ? -1 : 1;
			}
		  }
		});
		
		return Categories;
});