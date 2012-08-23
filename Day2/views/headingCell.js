define(['backbone', 'handlebars', 'text!templates/headingCell.html'], 
	function(Backbone, Handlebars, CellTpl){

		var HeadingCell = Backbone.View.extend({
			tagName:'th',
			id:'uid_', // This id will be a part of this.el when it is initialized
			className:"calendarColumnHeader", // This string of css classes will be a part of this.el when it is initialized
			template: Handlebars.compile(CellTpl),
			initialize:function(params){
				this.categories = params.categories;
				this.categories.on('change:headingId', this.checkCategory, this); // Changes in the model will determine the view state
			},
			events:{
				'change input:checkbox':'assignCategory',
				'keyup input:text':'updateTitle'
			},
			render:function(){
				// Set the id to reflect the model
				this.$el.attr('id', this.$el.attr('id')+this.model.get('id'));
				
				// Prepare data for template
				var data = this.model.toJSON();
				var categories = this.categories.toJSON();
				for(var i in categories) {
					// Pass header order to the category data so it can be used in {{#each}} to generate a unique checkbox id
					categories[i]['heading_order'] = this.model.get('order');
				}
				$.extend(data, {categories:categories});
				
				this.$el.html(this.template($.extend(data)));
				
				// check category inputs for categories that belong to this header
				var view = this;
				this.categories.forEach(function(model){
					view.checkCategory(model);
				});
				return this;
			},
			checkCategory:function(model){
				this.$('input[id*="'+model.get('id')+'"]').prop('checked', model.get('headingId') === this.model.get('id'));
			},
			assignCategory: function(event){
				var id = $(event.target).attr('id');
				var modelId = id.substr(5); // Remove the #uid_ prefix
				var model = this.categories.get(modelId); // We can retrieve a model from its collection by the model's id
					
				// Calling set() will trigger "change:headingId" and "change" events, our HeadingCell 
				// views are listening and will update themselves accordingly
				if($(event.target).is(':checked')){
					model.set('headingId', this.model.get('id'));
				} else {
					model.set('headingId', null);
				}
			},
			updateTitle:function(event){
				// Set returns false if validation fails, so we check it.  Note: the model will not be set with the invalid value!
				if(!this.model.set('title', $(event.target).val())) {
					$(event.target).addClass('invalid');
				} else {			
					$(event.target).removeClass('invalid');
				}
			}
		});

		return HeadingCell;

});