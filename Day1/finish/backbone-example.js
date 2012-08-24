/* Models */

var CalendarItem = Backbone.Model.extend({});

var Category = Backbone.Model.extend();

var Heading = Backbone.Model.extend({
	validate:function(attrs) {
		// Verify that the title is not empty
		if(attrs.title.length === 0) {
			return "Title cannot be empty";
		}
	}
});

/* Collections */

var CalendarItems = Backbone.Collection.extend({
  model: CalendarItem,
  url: 'api.php'
});

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

var Headings = Backbone.Collection.extend({
  model: Heading,
  comparator:function(model){
	// A 'sortBy' comparator
	return model.get('order');
  }
});

/* Views */

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

var HeadingCell = Backbone.View.extend({
	tagName:'th',
	id:'uid_', // This id will be a part of this.el when it is initialized
	className:"calendarColumnHeader", // This string of css classes will be a part of this.el when it is initialized
	template: Handlebars.compile(
		'<div class="innerWrapper" style="width: 100%; position: relative; ">'
			+'<div class="titleWrapper">'
				+'<input type="text" id="columnHeading" name="columnHeading" placeholder="Column Title" '
					+'value="{{title}}" class="columnHeadingTitle" size="30" maxlength="30" style="display: inline-block; ">'
			+'</div>'
			+'<div id="columnCategories" class="form" style="display: block; ">'
				+'<label>Show Categories:</label>'  
				+'{{#each categories}}'
				+'<label class="checkbox">' 
					+'<input type="checkbox" id="{{heading_order}}uid_{{id}}" name="{{heading_order}}uid_{{id}}">'        
					+'<label id="{{heading_order}}uid_{{id}}_label" for="{{heading_order}}uid_{{id}}" >{{title}}</label>'
				+'</label>'    
				+'{{/each}}'			
			+'</div>'
			+'<div class="condensedHeadingTitle" style="display: none; ">Column Title</div>'
		+'</div>'),
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

var DateRow = Backbone.View.extend({
	tagName:'tr',
	id:'calendarRow_',
	template: Handlebars.compile(
		'<td class="row-header" id="date_{{date_id}}">'
			+'<span class="td_dateText"><strong>{{day}}</strong> - {{month_date}}</span>'
		+'</td>'
	),
	initialize:function(params){		
		this.date = params.date;
		this.calendarItems = params.calendarItems;
		this.headings = params.headings;
		this.categories = params.categories;
		
		// Set the id to reflect the model
		this.$el.attr('id', this.$el.attr('id')+this.date.toString("yyyy-MM-dd"));
	},
	render:function(){				
		var data = {
			date_id:this.date.toString("yyyy-MM-dd"),
			day:this.date.toString("ddd"),
			month_date:this.date.toString("MMM dd")
		}
		
		this.$el.append(this.template(data));
		
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

var DateCell = Backbone.View.extend({
	tagName:'td',
	id:"date_",
	className:"sortable",
	template: Handlebars.compile(
		'{{#each items}}'
			+'<div id="uid_{{id}}" class="calendarItem" data-itemid="{{id}}">{{{text}}}</div>'
		+'{{/each}}'),
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

/* App */

// hard coded data
var headingsData = [
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
];

var categoryData = [
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
    order: 3
  },
  {
    id: 'cat3',
    headingId: 'col1',
    title: 'Exams',
    order: 2
  },
  {
    id: 'cat4',
    headingId: 'col3',
    title: 'Other',
    order: 4
  }
];

// Create a new headings collection, with data.
var headingsCollection = new Headings(headingsData);
console.log(headingsCollection);

// Create a new categories collection, with data.
var categoriesCollection = new Categories(categoryData);
console.log(categoriesCollection);

// Create a new calendar items collection, and fetch its data from the services.
var calendarItemsCollection = new CalendarItems();
calendarItemsCollection.fetch({
  async: false// halts execution until response is received.
});
console.log(calendarItemsCollection);

// initialize the main view with the data
(new CalendarView({headings:headingsCollection, calendarItems:calendarItemsCollection, categories:categoriesCollection})).render();