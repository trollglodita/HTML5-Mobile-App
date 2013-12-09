var NotesApp = (function () {
	var App = {
		stores: {},
		views: {}
	};



	// Initialize localStorage Data Store
	App.stores.notes = new Store('notes');

	// Model
	var Note = Backbone.Model.extend({
		// Use LocalStorage datastore
		localStorage: App.stores.notes,

		initialize: function () {
			if(!this.get('title')) {
				this.set({title: "Note @ " + Date()})
			};

			if(!this.get('body')) {
				this.set({body: "No content"})
			};			
		}

	});

	// Views
	var NewFormView = Backbone.View.extend({
		events: {
			"submit form": "createNote"
		},

		createNote: function(e) {
			var attrs = this.getAttributes(),
				note = new Note();

			note.set(attrs);
			note.save();

		},

		getAttributes: function(){
			return {
				title: this.$('form [name=title]').val(),
				body: this.$('form [name=body]').val(),
			}
		}

	});

	window.Note = Note;


	$(document).ready(function(){
		App.views.new_form = new NewFormView({
			el: $('#new')
		});
	})
	


	return App;
})();