//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: [
        " Hello, ",
        {
            html: "<span class=\"enabled\" />",
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
    enabled: Control.chain( "$Greet_content", "applyClass/enabled" ),
    punctuation: Control.chain( "$Greet_punctuation", "content" ),
    text: Control.chain( "$Greet_content", "text" ),

    initialize: function() {
        var self = this;
        this.$Greet_content().click(function() {
            if ( self.enabled() ) {
                var newName = prompt( "Enter name:", self.text() );
                if ( newName != null ) {
                    self.text( escape( newName ) );
                }
            }
        });
    }
});

//
// Page13
//
var Page13 = MarkupAreaPage.subclass({
    className: "Page13",
    title: "Controlling behavior",
    content: [
        " ",
        "<h2>Defining a property that governs behavior</h2>",
        " ",
        "<p>\nControl properties can do more than simply populate chunks of the control’s contents.\nControl properties can also modify the appearance of the control, for example by applying\nclasses that trigger the application of additional CSS rules. Control properties can also\nmodify control behavior.\n</p>",
        " ",
        "<p>\nIf we find there are cases where we don’t want our Greet control to be clickable, we\ncan govern that behavior by defining a “enabled” property. When this property is set\nto false, the control will ignore clicks:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        "<p>\nThe enabled property is defined by calling the helper function applyClass(),\nwhich returns a function that adds or removes a CSS class from a named element.\nThis function is identical to $.toggleClass() when invoked as a setter (i.e.,\nit sets the indicated class), and to $.hasClass() when invoked as a getter (it\nindicates whether or not the element has the indicated class). Here we use\nsome syntax supported by the chain() function to pass a parameter to applyClass:\nthe name of the class we want to get or set.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " The resulting Greet.enabled() function can be called with no parameters to obtain a boolean that indicates whether the CSS class \"enabled\" is currently applied. Alternatively, a boolean parameter can be supplied to add the indicated CSS style (if the parameter is true) or remove the style (if the parameter is false). We use the ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag to define the desired appearance of an enabled Greet instance to include a pointer control when the mouse is over the main content element. "
            ]
        },
        " ",
        "<p>\nIt's very common for a control to have a function like Greet.enabled() above which\ndelegates an aspect of its appearance to a CSS class. Significantly, hosts of this\ncontrol can remain unaware of the use of CSS, and confine their attention to the\nboolean semantics of the enabled() property.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " With this in place, our Sample control can now enable or disable a Greet control through markup. We can leave the first two ",
                {
                    control: "Tag",
                    content: "Greet"
                },
                " tags alone, but apply the disabled property to the third: "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nWith this change, clicking “Alice” or “Bob” will invoke the dialog we defined earlier,\nbut now clicking “Carol” will not.\n</p>",
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
            control: "Link",
            href: "/markup/tutorial/section14",
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
            enabled: "false",
            content: " <i>Carol</i> "
        },
        " "
    ]
});

