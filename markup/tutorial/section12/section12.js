//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: [
        " Hello, ",
        {
            html: "<span />",
            id: "Greet_content"
        },
        {
            html: "<span>.</span>",
            id: "Greet_punctuation"
        },
        " "
    ]
});
Greet.prototype.extend({
    
    content: Control.chain( "$Greet_content", "content" ),
    punctuation: Control.chain( "$Greet_punctuation", "content" ),
    text: Control.chain( "$Greet_content", "text" ),

    initialize: function() {
        var self = this;
        this.$Greet_content().click(function() {
            var newName = prompt( "Enter name:", self.text() );
            if ( newName != null ) {
                self.text( escape( newName ) );
            }
        });
    }    
});

//
// Page12
//
var Page12 = MarkupAreaPage.subclass({
    className: "Page12",
    title: "Defining interactivity",
    content: [
        " ",
        {
            html: "<p />",
            content: [
                " Earlier we saw how additional properties could be defined in the ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag. We can include arbitrary JavaScript in a ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag, including code that defines a control’s interactive behavior. As a trivial example, let’s give the Greet the ability to let the user click on the name and supply a new value for it. "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                " To do this, we’ll create an event handler for a click event on the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " that holds the name. The most convenient time to wire up the event handler is after the control’s markup has been fully rendered, when the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " is guaranteed to exist. The QuickUI invokes a method for this purpose called Control.ready(), similar to the document ready() method invoked by jQuery when a document has finished loading. By overriding a control’s ready() function, a control can have its own code execute when the control is instantiated. "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        {
            html: "<p />",
            content: [
                " Here the initialize() function creates a click handler for the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " identified by this.Greet_content. As we saw earlier, that property holds a reference to a HTMLSpanElement. We can pass that reference to the jQuery $() function and invoke its click method to create an event handler. "
            ]
        },
        " ",
        "<p>\nOur event handler reads the current value of the control’s content (i.e., the current name),\ngives the user a chance to override that, then saves the result back as the new content.\nFor this particular bit of interaction, we want to restrict display and input of the content\nas text, which we accomplish by defining a new property Greet.text(). This behaves \nlike the Greet.content() property, but will only return or accept plain text.\n</p>",
        " ",
        "<p>\nWith this in place, the user can now click on a name to change it. (The example below is\ninteractive.)\n</p>",
        " ",
        {
            control: "CodeOutput",
            content: [
                " ",
                {
                    control: "Sample"
                },
                " "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                " Note that above we also added a bit of styling to the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " to change the mouse cursor for that element to help confirm that it’s clickable. We might eventually consider replacing that ",
                {
                    control: "Tag",
                    content: "span"
                },
                " with a real ",
                {
                    control: "Tag",
                    content: "a"
                },
                " tag. Since we’ve factored our user interface controls well, we could do that without needing to rewrite controls like Sample that host the Greet control. "
            ]
        },
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section13",
            content: "Next >"
        },
        " "
    ]
});

//
// Sample
//
var Sample = Control.subclass({
    className: "Sample",
    content: [
        " ",
        "<h1>QuickUI sample</h1>",
        " ",
        {
            control: "Greet",
            content: "Alice"
        },
        " ",
        {
            control: "Greet",
            id: "bob",
            content: "Bob",
            punctuation: "!"
        },
        " ",
        {
            control: "Greet",
            punctuation: "?",
            content: " <i>Carol</i> "
        },
        " "
    ]
});

