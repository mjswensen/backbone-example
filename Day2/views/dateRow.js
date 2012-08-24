define(['backbone', 'handlebars', 'views/dateCell', 'text!templates/dateRow.txt', 'collections/calendarItems'], 
	function(Backbone, Handlebars, DateCell, RowTpl, CalendarItems) {

		var DateRow = Backbone.View.extend({
			tagName:'tr',
			id:'calendarRow_',
			template: Handlebars.compile(RowTpl),
			initialize:function(params){		
				this.date = params.date;
				this.calendarItems = params.calendarItems;
				this.headings = params.headings;
				this.categories = params.categories;
				
				// Set the id to reflect the model
				this.$el.attr('id', this.$el.attr('id')+this.date.toString("yyyy-MM-dd"));
			},
			render:function(){				
				this.$el.append(this.template({date:this.date}));
				
				var view = this;
				this.headings.forEach(function(model){
					// Find all the calendarItem models that belong to this cell
					var items = new CalendarItems();
					
					// where() returns an array of models whose attributes match those in the passed object
					var headingCategories = view.categories.where({headingId:model.get('id')}); 
					for(var i in headingCategories) {
						var categoryItems = view.calendarItems.where({categoryId:headingCategories[i].get('id'), date:view.date.toString('yyyy-MM-dd')});
						items.add(categoryItems);
					}
					
					var col = new DateCell({date:view.date, model:model, calendarItems:view.calendarItems, items:items, categories:view.categories});
					view.$el.append(col.render().$el);
				});
				
				return this;
			}
		});

		return DateRow;

});
