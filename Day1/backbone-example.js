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

var CalendarView = Backbone.View.extend({});

var HeadingsRow = Backbone.View.extend({});

var HeadingCell = Backbone.View.extend({});

var DatesRow = Backbone.View.extend({});

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