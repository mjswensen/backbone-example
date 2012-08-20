/* Calendar code goes here */

/* Models */

var CalendarItem = Backbone.Model.extend();

var Category = Backbone.Model.extend();

var Heading = Backbone.Model.extend();

/* Collections */

var CalendarItems = Backbone.Collection.extend({
  model: CalendarItem,
  url: 'api.php'
});

var Categories = Backbone.Collection.extend({
  model: Category
});

var Headings = Backbone.Collection.extend({
  model: Heading
});

/* Views */

var CalendarView = Backbone.View.extend({
	el:'#calendarTable',
	initialize:function(params) {
		// Just redraw all the date rows, in case calendar items move
		params.categories.on('change:headingId', this.redrawDates, this);
		this.categories = params.categories;
		this.headings = params.headings;
		this.calendarItems = params.calendarItems;
	},
	render:function() {
		var headingsView = new HeadingsRow({collection:this.headings, categories:this.categories});
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
			var dateView = new DateRow({date:today, headings:this.headings, calendarItems:this.calendarItems});
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

/* App */

// Create a new headings collection, with data.
var headingsCollection = new Headings([
  {
    id: 'col2',
    title: 'Column 2',
    order: 2
  },
  {
    id: 'col1',
    title: 'Column 1',
    order: 1
  },
  {
    id: 'col3',
    title: 'Column 3',
    order: 3
  }
]);
console.log(headingsCollection);

// Create a new categories collection, with data.
var categoriesCollection = new Categories([
  {
    id: 'cat1',
    headingId: 'col2',
    title: 'Homework Assignments',
    order: 1
  },
  {
    id: 'cat2',
    headingId: 'col2',
    title: 'Reading Assignments',
    order: 1
  },
  {
    id: 'cat3',
    headingId: 'col1',
    title: 'Exams',
    order: 1
  },
  {
    id: 'cat4',
    headingId: 'col3',
    title: 'Other',
    order: 1
  }
]);
console.log(categoriesCollection);

// Create a new calendar items collection, and fetch its data from the services.
var calendarItemsCollection = new CalendarItems();
calendarItemsCollection.fetch({
  async: false// halts execution until response is received.
});
console.log(calendarItemsCollection);



(new CalendarView({headings:headingsCollection, calendarItems:calendarItemsCollection, categories:categoriesCollection})).render();