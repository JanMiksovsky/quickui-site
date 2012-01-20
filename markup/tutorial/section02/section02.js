//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: " Hello, <i>world</i>! "
});

//
// Page02
//
var Page02 = MarkupAreaPage.subclass({
    className: "Page02",
    title: "How QuickUI works",
    content: [
        " ",
        "<h2>Quick markup</h2>",
        " ",
        "<p>\nQuickUI controls are defined with Quick markup, an XML format with no predefined schema\n(or, rather, a very loose one). This parallels the dynamic nature of JavaScript.\nThere are no fixed class definitions in JavaScript, so it would be impossible\nto statically determine at compile time which elements in markup are classes or properties.\nRather, qc (the Quick markup compiler) relies on some simple syntactic conventions to parse\nQuick markup.\n</p>",
        " ",
        "<p>\nQuick markup is comprised of the following element types, each identified by simple rules:\n</p>",
        " ",
        {
            html: "<ol />",
            content: [
                " ",
                {
                    html: "<li />",
                    content: [
                        " A single outer ",
                        {
                            control: "Tag",
                            content: "Control"
                        },
                        " tag. This is analogous to an ",
                        {
                            control: "Tag",
                            content: "html"
                        },
                        " tag for a document. The tag name, “Control”, must be capitalized. "
                    ]
                },
                " ",
                {
                    html: "<li />",
                    content: [
                        " HTML body elements. Any standard HTML 5 tag (",
                        {
                            control: "Tag",
                            content: "p"
                        },
                        ", ",
                        {
                            control: "Tag",
                            content: "input"
                        },
                        ", etc.) that can be used within the ",
                        {
                            control: "Tag",
                            content: "body"
                        },
                        " of an HTML document is recognized as HTML. The standard HTML tags are considered reserved in Quick markup, and may not be used to define custom members (below). HTML tags that are only valid outside the ",
                        {
                            control: "Tag",
                            content: "body"
                        },
                        ", such as ",
                        {
                            control: "Tag",
                            content: "head"
                        },
                        ", ",
                        {
                            control: "Tag",
                            content: "title"
                        },
                        ", etc., are not reserved in Quick markup. "
                    ]
                },
                " ",
                {
                    html: "<li />",
                    content: [
                        " Quick class tags. These allow you to instantiate one Quick control inside another. They correspond to JavaScript classes that derive from the Quick control base class, Control. Quick class tags begin with an uppercase letter, e.g., ",
                        {
                            control: "Tag",
                            content: "Greet"
                        },
                        ". This corresponds to the common JavaScript convention in which class names follow Pascal casing. A class tag may not the name of a standard HTML element (see above). "
                    ]
                },
                " ",
                {
                    html: "<li />",
                    content: [
                        " Quick property tags. As their name suggests, these correspond to JavaScript properties (instance variables). Quick property tags begin with an lowercase letter, e.g., ",
                        {
                            control: "Tag",
                            content: "name"
                        },
                        ". This corresponds to the JavaScript convention in which property names follow camel casing. A property tag may not the name of a standard HTML element (see above). "
                    ]
                },
                " "
            ]
        },
        " ",
        "<p>\nThese rules are straightforward, easy to remember in practice, and allow for efficient\ncompilation.\n</p>",
        " ",
        "<h2>Embedding HTML</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " In our sample Greet control, the ",
                {
                    control: "Tag",
                    content: "Control"
                },
                " tag is a Quick class tag because it's not a valid HTML tag, and it starts with an uppercase letter. Meanwhile, anywhere we have content we can embed plain HTML. Here we can extend our minimal Greet control to set one word in italics with an ",
                {
                    control: "Tag",
                    content: "i"
                },
                " tag: "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        "<h2>Control rendering</h2>",
        " ",
        "<p>\nIf we recompile the updated file above and open the generated Greet.js file,\nwe'll see the JavaScript which the qc compiler has generated:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "build/Greet.js"
        },
        " ",
        "<p>\n    This code defines Greet as a subclass of a class called Control, the base class from\n    which all QuickUI controls eventually derive. Control itself is a subclass of\n    the standard jQuery object. This means Greet inherits all the normal jQuery\n    operations, as well as some additional methods for working with controls.\n    Later on, we'll see how we can define class-specific methods and properties \n    for the Greet class which will only be available to Greet instances.\n</p>",
        " ",
        "<p>\n    The collection of properties passed to subclass\n    (the part in curly braces) is a compiled\n    version of the original Quick markup above. Here it simply states that the\n    control’s content should be a static HTML string.\n    As we’ll see, the contents of a control can become considerably more complex.\n    The key point is that the Quick markup is getting\n    compiled down to JavaScript code. Although it’s not visible in the code above,\n    the generated code ultimately invokes jQuery methods to populate the page DOM\n    with the desired elements.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " Earlier we saw how the Greet class could be instantiated via a call like: ",
                "<pre>\n$( \"body\" ).control( Greet );\n</pre>",
                " This code creates a jQuery object pointing to a particular DOM element (here, the page ",
                {
                    control: "Tag",
                    content: "body"
                },
                "), and then calls the QuickUI jQuery plugin $.control(). In this case, the extension instantiates the indicated Greet class, and invokes the method renderGreet() in the generated Greet.js file above. This produces the desired output, now with italics: "
            ]
        },
        " ",
        {
            control: "CodeOutput",
            content: [
                " ",
                {
                    control: "Greet"
                },
                " "
            ]
        },
        " ",
        "<h2>QuickUI classes as HTML element classes</h2>",
        " ",
        "<p>\nInspecting the DOM at run time for the above output (e.g., via a tool such as\n<a href=\"www.getfirebug.com\">Firebug</a>) reveals the following: \n</p>",
        " ",
        "<pre>\n&lt;html&gt;\n&lt;body class=\"Greet Control\"&gt;\n    Hello, \n    &lt;i&gt;world&lt;/i&gt;\n    !\n&lt;/body&gt;\n&lt;/html&gt;\n</pre>",
        " ",
        {
            html: "<p />",
            content: [
                " The $.control() plugin has instantiated the control, adding its initial contents (which were defined in the above call to Control.subclass) to the DOM. The ",
                {
                    control: "Tag",
                    content: "body"
                },
                " has also been stamped with two class names: Greet and Control. When QuickUI instantiates a control, it adds the name of its class and the names of all its parent classes to the “class” attribute of the element on which the control was instantiated. "
            ]
        },
        " ",
        "<p>\nThis is done for two reasons. First, it’s much easier to debug controls at run time\nif it’s clear which HTML elements were created by which QuickUI controls.\nSecond, this allows us to style QuickUI control contents effectively via CSS\n(more on that later).\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section03",
            content: "Next >"
        },
        " "
    ]
});

