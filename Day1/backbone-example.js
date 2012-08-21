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
  model: Category,
  comparator:function(model){return model.get('order');}
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
		this.$el.append('<thead id="calendarHead">');
		var headingsView = new HeadingsRow({collection:this.headings, categories:this.categories});
		this.$('thead').append(headingsView.render().$el);		
		this.redrawDates();
		return this;
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
	tagName:'tr',
	initialize:function(params){
		this.categories = params.categories;
	},
	render:function() {
		this.$el.append('<th id="dateColumn">Date</th>');
		var view = this;
		var headerNum = 0; // Allows checkboxes to have unique ids for labels' "for" attribute
		this.collection.forEach(function(headingModel){
			var headingView = new HeadingCell({model:headingModel, categories:view.categories, instanceNum:headerNum});
			view.$el.append(headingView.render().$el);
			headerNum++;
		});
		return this;
	}
});

var HeadingCell = Backbone.View.extend({
	tagName:'th',
	id:'uid_',
	className:"calendarColumnHeader",	
	template: Handlebars.compile(
		'<div class="innerWrapper" style="width: 100%; position: relative; ">'
			+'<div class="titleWrapper">'
				+'<input type="text" id="columnHeading" name="columnHeading" placeholder="Column Title" '
					+'value="{{title}}" class="columnHeadingTitle" size="30" maxlength="30" style="display: inline-block; ">'
			+'</div>'
			+'<div id="columnCategories" class="form" style="display: block; ">'
				+'<label>Show Categories:</label>'  
				+'{{#each categories}}'
				+'<div class="inlineLabel ">' 
					+'<input type="checkbox" id="{{num}}uid_{{id}}" name="{{num}}uid_{{id}}">'        
					+'<label id="{{num}}uid_{{id}}_label" for="{{num}}uid_{{id}}" >{{title}}</label>'
				+'</div>'    
				+'{{/each}}'			
			+'</div>'
			+'<div class="condensedHeadingTitle" style="display: none; ">Column Title</div>'
		+'</div>'),
	initialize:function(params){
		this.categories = params.categories;
		this.instanceNum = params.instanceNum;
		this.categories.on('change:headingId', this.checkCategory, this);
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
			// Pass header number to the category data so it can be used in {{#each}}
			categories[i]['num'] = this.instanceNum;
		}
		$.extend(data, {categories:categories});
		
		this.$el.html(this.template($.extend(data)));
		
		// Check categories that belong to this header
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
		var modelId = id.substr(5); // Remove the #uid_
		var model = this.categories.get(modelId);
			
		if($(event.target).is(':checked')){
			model.set('headingId', this.model.get('id'));
		} else {
			model.set('headingId', null);
		}
	},
	updateTitle:function(event){
		this.model.set('title', $(event.target).val());
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
	},
	render:function(){		
		// Set the id to reflect the model
		this.$el.attr('id', this.$el.attr('id')+this.date.toString("yyyy-MM-dd"));
		
		var data = {
			date_id:this.date.toString("yyyy-MM-dd"),
			day:this.date.toString("ddd"),
			month_date:this.date.toString("MMM dd")
		}
		
		this.$el.append(this.template(data));
		
		var view = this;
		this.headings.forEach(function(model){
			var items = new CalendarItems();
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
	template: Handlebars.compile(
		'<td id="date_{{date_id}}" class="sortable">'
			+'{{#each items}}'
				+'<div id="uid_{{id}}" class="calendarItem" data-itemid="{{id}}">{{{text}}}</div>'
			+'{{/each}}'
		+'</td>'),
	initialize:function(params){
		this.date = params.date;
		this.calendarItems = params.calendarItems;
		this.items = params.items;
		this.categories = params.categories;
	},
	events:{'click':'addItem'},
	render:function(){
		// Illustrates using setElement
		this.setElement(this.template({date_id:this.date.toString("yyyy-MM-dd"), items:this.items.toJSON()}));
		return this;
	},
	addItem:function(){
		var colCategories = this.categories.where({headingId:this.model.get('id')});
		if(colCategories.length > 0) { // Only create if there's a category to attach it to
			var text = prompt("Text");
			var item = new CalendarItem({date:this.date.toString("yyyy-MM-dd"), text:text, categoryId:colCategories[0].get('id')});
			this.calendarItems.add(item);
			this.items.add(item);
			this.$el.replaceWith(this.template({date_id:this.date.toString("yyyy-MM-dd"), items:this.items.toJSON()}));
		}
	}
});

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
var calendarItemsCollection = new CalendarItems([
	{
		id:'item1',
		categoryId:'cat3',
		text:'Item 1',
		date:'2012-08-01'
	},
	{
		id:'item2',
		categoryId:'cat1',
		text:'Item 2',
		date:'2012-08-14'
	},
	{
		id:'item3',
		categoryId:'cat4',
		text:'Item 3',
		date:'2012-08-05'
	},
	{
		id:'item4',
		categoryId:'cat2',
		text:'Item 4',
		date:'2012-08-21'
	},
	{
		id:'item5',
		categoryId:'cat1',
		text:'Item 5',
		date:'2012-08-29'
	},
	{
		id:'item6',
		categoryId:'cat4',
		text:'Item 6',
		date:'2012-08-05'
	}
]);
/*calendarItemsCollection.fetch({
  async: false// halts execution until response is received.
});*/
console.log(calendarItemsCollection);



(new CalendarView({headings:headingsCollection, calendarItems:calendarItemsCollection, categories:categoriesCollection})).render();