define(['backbone', 
	'handlebars', 
	'text!templates/dateCell.mustache', 
	'models/calendarItem'], 
	
	function(Backbone, Handlebars, CellTpl, CalendarItem) {
	
		var DateCell = Backbone.View.extend({
			tagName:'td',
			id:"date_",
			className:"sortable",
			template: Handlebars.compile(CellTpl),
			initialize:function(params){
				this.date = params.date;
				this.calendarItems = params.calendarItems;
				this.items = params.items;
				this.categories = params.categories;
				
				this.items.on('add remove', this.render, this); // Listen to changes in the collection and redraw. Notice that it is a space separated list
				
				// Set the id to reflect the model
				this.$el.attr('id', this.$el.attr('id')+this.date.toString("yyyy-MM-dd"));
			},
			events:{'click':'addItem'}, // No selector in the event key, so it is delegated to the view
			render:function(){		
				this.$el.html(this.template({date_id:this.date.toString("yyyy-MM-dd"), items:this.items.toJSON()}));
				return this;
			},
			addItem:function(){
				// For the sake of simplicity, we add new items to the first available category, if it exists
				var colCategories = this.categories.where({headingId:this.model.get('id')});
				if(colCategories.length > 0) { // Only create if there's a category to attach it to
					var text = prompt("Text");
					var item = new CalendarItem({date:this.date.toString("yyyy-MM-dd"), text:text, categoryId:colCategories[0].get('id')});
					this.calendarItems.add(item); // Add to the reference collection
					this.items.add(item); // Add to the view's renderable collection, this triggers a render
				}
			}
		});

		return DateCell;
});