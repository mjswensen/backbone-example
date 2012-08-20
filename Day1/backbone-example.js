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