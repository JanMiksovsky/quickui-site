//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: [
        " Hello, ",
        {
            html: "<i />",
            content: [
                {
                    html: "<span />",
                    id: "Greet_content"
                }
            ]
        },
        "! "
    ]
});
Greet.prototype.extend({
    content: function( value ) {
        if ( value === undefined ) {
            return this.$Greet_content().eq(0).html();
        } else {
            this.$Greet_content().html( value );
            return this;
        }
    }
});

//
// Page06
//
var Page06 = MarkupAreaPage.subclass({
    className: "Page06",
    title: "Setting control properties",
    content: [
        " ",
        "<h2>Setting a property through markup</h2>",
        " ",
        "<p>\nNow that we’ve defined a new property called Greet.content, the property can be set\nthrough QuickUI markup. The simplest way to do this is by setting an attribute on the\ncontrol tag. Here’s our Sample control again, which holds three instances of Greet.\nWe can now give each instance different content:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nThis outputs:\n</p>",
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
        "<p>\nAs will be described later, through a different markup syntax we can also easily\nset a property’s value to arbitrarily complex content.\n</p>",
        " ",
        "<h2>Setting a property through JavaScript</h2>",
        " In addition to setting properties at design time through markup, we can also read and manipulate control properties at run time through JavaScript. As described earlier, QuickUI control classes are regular prototype-based JavaScript classes, and control properties can be read as members of the control class. The standard convention for QuickUI properties is to use setter/getter functions. If we have a reference to a control, we can simply call the property function and pass in the new desired value for the property: ",
        "<pre>\nvar g = $( \"body\" ).control( Greet );   // Instantiate the control.\ng.content( \"Dan\" );                     // Set a property.\n</pre>",
        " ",
        "<p>\nAs a shorthand, we can also instantiate a control instance and immediately set\nproperties on it through optional arguments to the jQuery plugin:\n</p>",
        " ",
        "<pre>\n// Instantiate the control and set its content in one step.\n$( \"body\" ).control( Greet, { content: \"Dan\" });\n</pre>",
        " ",
        "<p>\nTo read the current value of a QuickUI control property, we can call the\nproperty function with no arguments:\n</p>",
        " ",
        "<pre>\nvar g = $( \"body\" ).control();        // Retrieve a reference to the control.\nvar name = g.content();             // Get the control's current content.\n</pre>",
        " ",
        "<h2>Casting</h2>",
        " ",
        "<p>\nThe first line above calls the control() function as a getter. This returns\nthe current jQuery selection <i>cast to the correct class</i>. When a QuickUI\ncontrol is first instantiated, the framework saves data on the control's top-level\nelement which records the control's class. A normal jQuery selector like $(\"body\")\nreturns an instance of the jQuery class. By applying the control() plug-in, the\nresult is cast back to the control's original class. That class is a subclass of\njQuery, so all the normal jQuery operations can be applied to it — as well as\nany custom properties like the content() property we've defined here.\n</p>",
        " ",
        "<pre>\nvar s = $( \"body\" );          // s is instance of jQuery\nvar g = s.control();        // g is instance of Greet\n</pre>",
        " ",
        "<h2>Setting properties on an array of controls</h2>",
        " ",
        "<p>\nSince jQuery objects are arrays that may have more than one member, QuickUI\nproperties and methods are generally designed to work across an array of controls.\nThis means that we can use jQuery to find a collection of controls, cast them\nto the correct control class, then perform bulk operations on them. For example,\nwe can set the content() property of all of them in one property call:\n</p>",
        " ",
        "<pre>\n$(\".Greet\")                 // Get all Greet elements on the page.\n    .control()              // Cast them to their original Greet class.\n    .content( \"Angela\" );   // Set the content of all of them at once.\n</pre>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section07",
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
            content: "Bob"
        },
        " ",
        {
            control: "Greet",
            content: "Carol"
        },
        " "
    ]
});

