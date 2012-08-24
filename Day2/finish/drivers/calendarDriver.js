/** A driver can provide an abstraction for complex module relationships and, 
when created as an entry point for a page, can serve as an optimization target.*/
define(['collections/headings', 
	'collections/categories', 
	'collections/calendarItems', 
	'views/calendarView'], 
	
	function(Headings, Categories, CalendarItems, CalendarView) {

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
		
		// Return a simple API for whoever uses this driver
		return {
			/** Initialize our app */
			init : function(){	
				(new CalendarView({headings:headingsCollection, calendarItems:calendarItemsCollection, categories:categoriesCollection})).render();
			}
		}
});