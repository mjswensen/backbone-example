define(['backbone', 'views/headingCell'], 
	function(Backbone, HeadingCell){

		var HeadingsRow = Backbone.View.extend({
			tagName:'tr', // TagName property determines type of element view represents. Default is div
			initialize:function(params){
				this.categories = params.categories;
			},
			render:function() {
				this.$el.append('<th id="dateColumn">Date</th>'); // this.$el a jQuery instance of the views DOM element, equivalent to $(this.el)
				var view = this;
				this.collection.forEach(function(headingModel){
					var headingView = new HeadingCell({model:headingModel, categories:view.categories});
					view.$el.append(headingView.render().$el);
				});
				return this;
			}
		});

		return HeadingsRow;

});