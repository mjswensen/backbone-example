define(['backbone'], 

	function(Backbone){

		var Heading = Backbone.Model.extend({
			validation: {
				title: {
					// Uses a Backbone.Validation validator, which can then be bound to a view
					required: true,
					msg: "You must have a title."
				}
			}
		});

		return Heading;
});