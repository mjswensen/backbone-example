define(['backbone', 
	'views/headingsRow', 
	'views/dateRow'], 
	
	function(Backbone, HeadingsRow, DateRow){

		var CalendarView = Backbone.View.extend({
			el:'#calendarTable', // Use a jQuery selector in el to attach view to existing DOM element
			initialize:function(params) {
				// Just redraw all the date rows, in case calendar items move
				params.categories.on('change:headingId', this.redrawDates, this);
				
				// For this example, I've chosen to abstract out global data by passing the global collections as parameters
				this.categories = params.categories;
				this.headings = params.headings;
				this.calendarItems = params.calendarItems;
			},
			render:function() {
				this.$el.append('<thead id="calendarHead">');
				var headingsView = new HeadingsRow({collection:this.headings, categories:this.categories});
				this.$('thead').append(headingsView.render().$el);	// this.$() is equivalent to this.$el.find()	
				this.redrawDates();
				return this; // Return "this" for method chaining, as seen above in "headingsView.render().$el"
			},
			redrawDates: function() {
				this.$('tbody').remove(); // Remove old view
				
				this.$el.append('<tbody>');
				for(var i = 0; i < 31; i++) {
					var today = Date.parse("8/1/2012").addDays(i);
					var dateView = new DateRow({date:today, headings:this.headings, calendarItems:this.calendarItems, categories:this.categories});
					this.$el.append(dateView.render().$el);
				}
			}
		});

		return CalendarView;

});