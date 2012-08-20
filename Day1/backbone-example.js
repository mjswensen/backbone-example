/* Calendar code goes here */

/* Models */

var CalendarItem = Backbone.Model.extend();

var Category = Backbone.Model.extend();

var Heading = Backbone.Model.extend();

/* Collections */

var CalendarItems = Backbone.Collection.extend({
  model: CalendarItem
});

var Categories = Backbone.Collection.extend({
  model: Category
});

var Headings = Backbone.Collection.extend({
  model: Heading
});


//Global reference for data on client, so that everyone can point to same collection
var Datastore = {
	headings : new Headings(),
	categories : new Categories(),
	calendarItems : new CalendarItems(),
}

/* Views */
var CalendarView = Backbone.View.extend({
	el:'#calendarTable',
	initialize:function() {
		// Just redraw all the date rows, in case calendar items move
		Datastore.categories.on('change:headingId', this.redrawDates, this);
	},
	render:function() {
		var headingsView = new HeadingsRow({collection:Datastore.headings, categories:Datastore.categories});
		this.$el.append(headingsView.render().$el);		
		this.redrawDates();
		return this;
	},
	redrawDates: function() {
		this.$('tbody').remove(); // Remove old view
		
		this.$el.append('<tbody>');
		var today = Date.parse("8/1/2012");
		for(var i = 0; i < 30; i++) {
			today = today.addDays(1);
			var dateView = new DateRow({date:today, headings:Datastore.headings, calendarItems:Datastore.calendarItems});
			this.$el.append(dateView.render().$el);
		}
	}
});

var HeadingsRow = Backbone.View.extend({
	tagName:'thead',
	render:function() {
		this.$el.append('<tr>');
		return this;
	}
});

var HeadingCell = Backbone.View.extend({});

var DateRow = Backbone.View.extend({
	tagName:'tr'
});

var DateCell = Backbone.View.extend({});

(new CalendarView()).render();