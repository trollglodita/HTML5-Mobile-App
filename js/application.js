var NotesApp = (function(){
  var App = {
    stores: {},
    views: {},
    collections: {}
  }
  
  // Initialize localStorage Data Store
  App.stores.notes = new Store('notes');
  
  
  // Note Model
  var Note = Backbone.Model.extend({
    // Use localStorage datastore
    localStorage: App.stores.notes,
    
    initialize: function(){
      if(!this.get('title')){
        this.set({title: "Note @ " + Date() })
      };
      
      if(!this.get('body')){
        this.set({body: "No Content"})
      };
    }
    
  })
  
  
  var NoteList = Backbone.Collection.extend({
    // This collection is composed of Note objects
    model: Note,
    
    // Set the localStorage datastore
    localStorage: App.stores.notes,
    
    initialize: function(){
      var collection = this;
      
      // When localStorage updates, fetch data from the store
      this.localStorage.bind('update', function(){
        collection.fetch();
      })
    }
    
  })
  
  
  // Views
  var NewFormView = Backbone.View.extend({
    events: {
      "submit form":  "createNote"
    },
        
    createNote: function(e){
      var attrs = this.getAttributes(),
          note = new Note();
          
      note.set(attrs);
      note.save();
      
      // Stop browser from actually submitting the form (or following the link)
      e.preventDefault();
      // Stop jQuery Mobile from doing its form magic. We got this.
      e.stopPropagation();
      
      //Close
      $('.ui-dialog').dialog('close');
      this.reset();
    },
    
    getAttributes: function(){
      return {
        title: this.$('form [name=title]').val(),
        body: this.$('form [name=body]').val()
      }
    },
    
    reset: function(){
      // Normal form.reset() would be ideal, but current causes
      // jQuery Mobile switches to fall out of sync
      this.$('input, textarea').val('');
    }
    
  });
  
  
  // Represents a listview page displaying a collection of Notes
  // Each item is represented by a NoteListItemView
  var NoteListView = Backbone.View.extend({
    
    initialize: function(){
      _.bindAll(this, 'addOne', 'addAll');
      
      this.collection.bind('add', this.addOne);
      this.collection.bind('refresh', this.addAll);
      
      this.collection.fetch();
    },
    
    addOne: function(note){
      var view = new NoteListItemView({model: note});
      $(this.el).append(view.render().el);
      
      if('mobile' in $){
        $(this.el).listview().listview('refresh');
      }
    },
    
    addAll: function(){
      $(this.el).empty();
      this.collection.each(this.addOne);
    }
    
    
  });
  
  var NoteListItemView = Backbone.View.extend({
    tagName: 'LI',
    template: _.template($('#note-list-item-template').html()),
    
    initialize: function(){
      _.bindAll(this, 'render')
      
      this.model.bind('change', this.render)
    },
    
    render: function(){
      $(this.el).html(this.template({ note: this.model }))
      return this;
    }
    
  })
  
  /* Container fore NoteDetailView
   *
   * Responsible for generating each NoteDetailView 
   */
  var NoteDetailList = Backbone.View.extend({
    // Render NoteDetailView[s] into this element
    el: $('#note-detail-list'),
  

    initialize: function(){
      // Make sure all functions execute with the correct 'this'
      _.bindAll(this, 'addOne', 'addAll', 'render');
    
    
      this.collection.bind('add', this.addOne);
      this.collection.bind('refresh', this.addAll);
    
      this.collection.fetch();
    },
  
    addOne: function(note){
      var view = new NoteDetailView({model: note});
      $(this.el).append(view.render().el);
      if($.mobile)
        $.mobile.initializePage();
    },
  
    addAll: function(){
      $(this.el).empty();
      this.collection.each(this.addOne);
    }
  });
  
  
  /**
  * Show Page
  */
  var NoteDetailView = Backbone.View.extend({
    // View based on a DIV tag
    tagName: "DIV",

  
    // Use a template to interpret vakues
    template: _.template($('#note-detail-template').html()),
  
  
    initialize: function(){
      // Make sure render is always called with this = this view
      _.bindAll(this, 'render');
    
      // Updated this div with jQuery Mobile data-role, and unique ID
      $(this.el).attr({
        'data-role': 'page',
        'id': "note_" + this.model.id
      });
    
      // Whenever the model changes, render this view
      this.model.bind('change', this.render);
    },
  
    // Render the view into this View's element
    render: function(){
      $(this.el).html(this.template({note: this.model}));
      return this;
    },

  });
  
    
  
  
  
  window.Note = Note;
  
  App.collections.all_notes = new NoteList();
  
  App.views.new_form = new NewFormView({
    el: $('#new')
  });
  
  App.views.list_alphabetical = new NoteListView({
    el: $('#all_notes'),
    collection: App.collections.all_notes
  });
  
  // Initialize View for collection of all Note Detail pages
  App.views.notes = new NoteDetailList({
    collection: App.collections.all_notes
  });
  
  

  
  
  
  
  
  
  return App;
})();




