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
    punctuation: Control.chain( "$Greet_punctuation", "content" )
});

//
// Page09
//
var Page09 = MarkupAreaPage.subclass({
    className: "Page09",
    title: "Control content",
    content: [
        " ",
        {
            html: "<p />",
            content: [
                " The previous section on the ",
                {
                    control: "Link",
                    href: "/markup/tutorial/section08",
                    content: " markup with properties"
                },
                " described how we could implicitly set the content of a control instance by placing elements inside a control’s tag. It turns out we can do the same thing to the top level ",
                {
                    control: "Tag",
                    content: "Control"
                },
                " tag as well. "
            ]
        },
        " ",
        "<p>\nAt the start of this tutorial, we defined the Greet control in a compact form:\n</p>",
        " ",
        "<pre>\n&lt;Control name=\"Greet\"&gt;\n    Hello, world!\n&lt;/Control&gt;\n</pre>",
        " ",
        "<p>\nIn fact, this is just shorthand for an explicit form:\n</p>",
        " ",
        "<pre>\n&lt;Control name=\"Greet\"&gt;\n\n&lt;content&gt;\n    Hello, world!\n&lt;/content&gt;\n\n&lt;/Control&gt;\n</pre>",
        " ",
        {
            html: "<p />",
            content: [
                " In other words, the ",
                {
                    control: "Tag",
                    content: "content"
                },
                " within a top-level ",
                {
                    control: "Tag",
                    content: "Control"
                },
                " class defines the default contents of new instances of that class. The generated JavaScript code for a control class, in fact, simply creates a new instance of the QuickUI base class, Control, then invokes that class’ content() property setter. "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                " The control’s ",
                {
                    control: "Tag",
                    content: "content"
                },
                " is optional. As a general rule, very simple controls that serve as HTML macros are perhaps easier to read without explicit use of the ",
                {
                    control: "Tag",
                    content: "content"
                },
                " tag. When the top-level ",
                {
                    control: "Tag",
                    content: "Control"
                },
                " tag grows to include additional child tags, like ",
                {
                    control: "Tag",
                    content: "script"
                },
                " above, it seems like inclusion of ",
                {
                    control: "Tag",
                    content: "content"
                },
                " can help delineate those different aspects of the control. "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                "Accordingly, we can now include an explicit ",
                {
                    control: "Tag",
                    content: "content"
                },
                " tag in our sample Greet control to (arguably) improve legibility: "
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
                " In this light, the ",
                {
                    control: "Tag",
                    content: "content"
                },
                " of a control in a Quick markup file is analogous to the ",
                {
                    control: "Tag",
                    content: "body"
                },
                " of an HTML file. Whereas HTML places the ",
                {
                    control: "Tag",
                    content: "body"
                },
                " at the end, by convention Quick markup places ",
                {
                    control: "Tag",
                    content: "content"
                },
                " first, as its almost always the first thing one wants to read to understand what a control does and how it will look at run-time. "
            ]
        },
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section10",
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
            punctuation: "!",
            content: "Bob"
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

