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
  model: Heading,
  comparator:function(model){return model.get('order');}
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
		this.$el.append('<thead>');
		var headingsView = new HeadingsRow({collection:this.headings, categories:this.categories});
		this.$('thead').append(headingsView.render().$el);		
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
	tagName:'tr',
	initialize:function(params){
		this.categories = params.categories;
	},
	render:function() {
		this.$el.append('<tr>');
		this.$el.append('<td>Date</td>');
		var view = this;
		var headerNum = 0; // Allows checkboxes to have unique ids for labels "for" attribute
		this.collection.forEach(function(headingModel){
			var headingView = new HeadingCell({model:headingModel, categories:view.categories, instanceNum:headerNum});
			view.$el.append(headingView.render().$el);
			headerNum++;
		});
		return this;
	}
});

var HeadingCell = Backbone.View.extend({
	tagName:'td',
	template: Handlebars.compile('<input type="text" value="{{title}}"/>'
		+'{{#each categories}}'
		+'<div class="inlineLabel">' 
			+'<input type="checkbox" id="{{num}}uid_{{id}}" name="{{num}}uid_{{id}}">'        
			+'<label id="{{num}}uid_{{id}}_label" for="{{num}}uid_{{id}}" >{{title}}</label>'
		+'</div>'
		+'{{/each}}'),
	initialize:function(params){
		this.categories = params.categories;
		this.instanceNum = params.instanceNum;
		this.categories.on('change:headingId', this.checkCategory, this);
	},
	events:{
		'change input:checkbox':'assignCategory'
	},
	render:function(){
		// Prepare data for template
		var data = this.model.toJSON();
		var categories = this.categories.toJSON();
		for(var i in categories) {
			// Pass header number to the category data so it can be used in {{#each}}
			categories[i]['num'] = this.instanceNum;
		}
		$.extend(data, {categories:categories});
		
		this.$el.html(this.template($.extend(data)));
		var view = this;
		this.categories.forEach(function(model){
			view.checkCategory(model);
		});
		return this;
	},
	checkCategory:function(model){	
		this.$('input[id*="'+model.get('id')+'"]').prop('checked', model.get('headingId') === this.model.get('id'));
	},
	assignCategory: function(){
		
	}
});

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