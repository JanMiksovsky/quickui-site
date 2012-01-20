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
        {
            html: "<span>.</span>",
            id: "Greet_punctuation"
        },
        " "
    ]
});
Greet.prototype.extend({
    content: Control.chain( "$Greet_content", "content" ),
    punctuation: Control.chain( "$Greet_punctuation", "content" )
});

//
// Page07
//
var Page07 = MarkupAreaPage.subclass({
    className: "Page07",
    title: "Compact property definition using property bindings",
    content: [
        " ",
        "<h2>Declaring a property using a chain of jQuery calls</h2>",
        " ",
        "<p>\nDefining a control property like Greet.content is so common, the QuickUI framework\nincludes some JavaScript helper classes to more concisely define common types of properties.\nThe Greet.content property in this example is a very common type of property:\na control property backed by, or <i>bound to</i>, the contents of a specific\nHTML element within the control’s DOM.\n</p>",
        " ",
        "<pre>\ncontent: function( value ) {\n    if ( value === undefined ) {\n        return this.$Greet_content().eq(0).html();\n    } else {\n        this.$Greet_content().html( value );\n        return this;\n    }\n}\n</pre>",
        " ",
        "<p>\nTo facilitate construction of such functions, the QuickUI run-time library includes\na helper function called chain() that serves as a factory for functions like the one above.\nSo we can replace the above property definition with this one:\n</p>",
        " ",
        "<pre>\ncontent: Control.chain( \"$Greet_content\", \"html\" )\n</pre>",
        " ",
        "<p>\nThe function chain() itself returns a function that will apply the indicated\nparameters as a jQuery-style chain. When invoked as a setter, i.e., with a defined\nargument, the function will pass that argument to the function indicated by the final\nparameter. In the above example, that would be $.html(). As a result, the two function\ndefinitions above are equivalent.\n</p>",
        " ",
        "<p>\nUsing chain reduces the amount of code required to define control properties,\nand correspondingly reduces the chances for bugs. It also allows someone else reading the\ncode to clearly see the intent of the property declaration. In the example above,\nthe developer wishes to expose the HTML content an element called with id=\"Greet_content\"\nvia a getter/setter function called content().\n</p>",
        " ",
        "<h2>Using the content() function</h2>",
        " ",
        "<p>\nThe use of the $.html() function above can be replaced with a more flexible function\ndefined in QuickUI called content(). The $.html() function can only deal with strings,\nbut the content() function can work with real DOM elements or jQuery objects.\nIn that regard, it's similar the jQuery $.contents() function (with a plural \"s\"),\nonly content() can also be called as a setter while $.contents() is read-only.\n</p>",
        " ",
        "<p>\nSo it will generally be more useful to define our content function with content()\nas the last part of the chain:\n</p>",
        " ",
        "<pre>\ncontent: Control.chain( \"$Greet_content\", \"content\" )\n</pre>",
        " ",
        "<p>\nThis definition uses the word \"content\" several times. What it says is, \"The content\nof a Greet control can be saved in, or read from, the content of the element called\nwith id='Greet_content'.\" In other words, the Greet control is <i>delegating</i>\nits content to one of the elements it contains.\n</p>",
        " ",
        "<h2>Defining multiple “slots” with additional properties</h2>",
        " ",
        "<p>\nLet’s adapt our Greet control to use the Control.chain() property factory above.\nSince it’s so easy to define new control properties, let’s extend our Greet control\nwith an additional property to control the type of punctuation used at the end of the\ngreeting:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        "<p>\nWe can then use the new slot like this:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nThis produces:\n</p>",
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
        "<p>\nBoth the control content and the additional punctuation can be set separately.\nIn this way, you can easily define various “slots” for content which can then be filled in by\nconsumers of your control. A common use for this is to create templates of various kinds:\ntemplates for chunks of content that vary only in certain places, templates for entire pages,\netc.\n</p>",
        " ",
        "<h2>Chaining property calls</h2>",
        " ",
        "<p>\nProperty functions defined using chain return \"this\", and therefore support jQuery-style\nchaining.\n</p>",
        " ",
        "<pre>\n$(\".Greet\")                 // Get all Greet elements on the page.\n    .control()              // Cast them to their original Greet class.\n    .content( \"Angela\" )    // Set the content of all of them.\n    .punctuation( \"!\" );    // Set the punctunation of all of them.\n</pre>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section08",
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
            content: "Bob",
            punctuation: "!"
        },
        " ",
        {
            control: "Greet",
            content: "Carol",
            punctuation: "?"
        },
        " "
    ]
});

