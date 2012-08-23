define(['backbone'], 
	function(Backbone){

		var Heading = Backbone.Model.extend({
			validate:function(attrs) {
				// Verify that the title is not empty
				if(attrs.title.length === 0) {
					return "Title cannot be empty";
				}
			}
		});

		return Heading;
});