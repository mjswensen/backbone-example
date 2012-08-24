define(['backbone', 
	'models/calendarItem'], 
	
	function(Backbone, CalendarItem){

		var CalendarItems = Backbone.Collection.extend({
		  model: CalendarItem,
		  url: 'api.php'
		});
		
		return CalendarItems;
});