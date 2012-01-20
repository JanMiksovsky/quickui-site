//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: " Hello, <i>world</i>! "
});

//
// Page03
//
var Page03 = MarkupAreaPage.subclass({
    className: "Page03",
    title: "Composing QuickUI controls",
    content: [
        " ",
        "<h2>Assembling more complex controls</h2>",
        " ",
        "<p>\nIn Quick markup, you can create your own tags instead of being limited to the 90 or so\ndefined in HTML. Once you’ve defined a new QuickUI control class,\nyou’ve effectively defined a new tag you can use in Quick markup wherever you can use HTML.\nThis lets you easily compose or assemble a complex control from simpler parts.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " Let’s define a new QuickUI class called Sample, and then use our new ",
                {
                    control: "Tag",
                    content: "Greet"
                },
                " tag to create multiple instances of the Greet class: "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nWe can save the above markup in a file called Sample.qui and rebuild our project.\n</p>",
        " ",
        "<pre>\n$ <b>qb</b>\nSample.qui\ndemo.js\ndemo.css\n$ \n</pre>",
        " ",
        {
            html: "<p />",
            content: [
                " The qb build tool has found Sample.qui, and used this to generate build/Sample.js, which now defines our new Sample class. We can rewrite the key ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag contents in demo.html to instantiate the Sample control class (instead of the original Greet class): "
            ]
        },
        " ",
        "<pre>\n&lt;script language=\"JavaScript\"&gt;\n$(function() {\n    $( \"body\" ).control( Sample );\n});\n&lt;/script&gt;\n</pre>",
        " ",
        "<p>\nOpening this page now produces three instances of our Greet control:\n</p>",
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
                " Again, at this stage we’re really just defining an HTML macro. Inspecting the DOM at run time reveals that each ",
                {
                    control: "Tag",
                    content: "Greet"
                },
                " tag has been expanded to contain an independent copy of the contents defined for the Greet class earlier: "
            ]
        },
        " ",
        "<pre>\n&lt;body class=\"Sample Control\"&gt;\n    &lt;h1&gt;QuickUI Sample&lt;/h1&gt;\n    &lt;div class=\"Greet Control\"&gt;\n        Hello,\n        &lt;i&gt;world&lt;/i&gt;\n        !\n    &lt;/div&gt;\n    &lt;div class=\"Greet Control\"&gt;\n        Hello,\n        &lt;i&gt;world&lt;/i&gt;\n        !\n    &lt;/div&gt;\n    &lt;div class=\"Greet Control\"&gt;\n        Hello,\n        &lt;i&gt;world&lt;/i&gt;\n        !\n    &lt;/div&gt;\n&lt;/body&gt;\n</pre>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section04",
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
            control: "Greet"
        },
        " ",
        {
            control: "Greet"
        },
        " ",
        {
            control: "Greet"
        },
        " "
    ]
});

