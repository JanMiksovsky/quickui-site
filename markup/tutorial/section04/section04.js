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

//
// Page04
//
var Page04 = MarkupAreaPage.subclass({
    className: "Page04",
    title: "Referencing control elements",
    content: [
        " ",
        "<p>\nEven the fixed HTML content we’ve been dealing with thus far has some utility, but controls\nobviously get much more interesting when their content is dynamic. As a trivial example, let’s\nchange our Greet control so that someone using that control can have the Greet control\nrefer to a specific person by name. The name will be able to vary from control instance\nto control instance.\n</p>",
        " ",
        "<p>\nWhen we’re finished, we’ll be able to set a property on a control through JavaScript:\n</p>",
        " ",
        "<pre>\nvar g = $( \"div\" ).control( Greet );\ng.content( \"Alice\" );\n</pre>",
        " ",
        "<p>\nand through Quick markup:\n</p>",
        " ",
        "<pre>\n&lt;Greet&gt;Alice&lt;/Greet&gt;\n</pre>",
        " ",
        "<p>\nwith the goal that either of the above would output something like, “Hello, Alice!”\n</p>",
        " ",
        "<h2>Identifying control elements with IDs</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " First we need to identify where the name should be rendered in the control content by using a standard HTML “id” attribute. We can replace the static text “world” used earlier with a ",
                {
                    control: "Tag",
                    content: "span"
                },
                " that has an ID: "
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
                " (We could make this more efficient by assigning the ID to the ",
                {
                    control: "Tag",
                    content: "i"
                },
                " tag itself, but the above arrangement is more convenient for some modifications we’ll make later.) "
            ]
        },
        " ",
        "<h2>Element functions</h2>",
        " ",
        "<p>\nAt compile time, the qc compiler traverses the Quick markup looking for HTML tags or QuickUI class\ntags with “id” attributes. Any IDs found in this way will be compiled into JavaScript properties\non the control class. The key property assignment to this.Greet_content can be found halfway through\nthe generated code:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "build/Greet.js"
        },
        " ",
        "<p>\nThe key line is the one that defines an ID property:\n</p>",
        " ",
        "\n<pre>\n                    id: \"Greet_content\"\n</pre>\n",
        " ",
        "<p>\nThis property has three effects:\n</p>",
        " ",
        {
            html: "<ol />",
            content: [
                " ",
                {
                    html: "<li />",
                    content: [
                        " First, the line will set the ID attribute of the indicated HTML ",
                        {
                            control: "Tag",
                            content: "span"
                        },
                        ". "
                    ]
                },
                " ",
                {
                    html: "<li />",
                    content: [
                        " Second, the line will cause QuickUI to save a reference to that element behind the scenes, as part of the control's $.data(). This reference is created the instant the ",
                        {
                            control: "Tag",
                            content: "span"
                        },
                        " is created. This ensures that the control can always quickly retrieve the specific ",
                        {
                            control: "Tag",
                            content: "span"
                        },
                        " that belongs to it. This is both safer and faster than trying to search again for that element. (When one control contains another control, the possibility arises for an ID collision.) "
                    ]
                },
                " ",
                {
                    html: "<li />",
                    content: [
                        " Third, as a side effect, QuickUI will define a new function on the Greet prototype called $Greet_content(). This is called an ",
                        "<i>element function</i>",
                        " that returns the saved reference to the ",
                        {
                            control: "Tag",
                            content: "span"
                        },
                        ". An element function is essentially a mapping function that maps a control, or array of controls, to the desired sub-elements in the control's DOM. E.g., if we are holding a jQuery array of three Greet instances, then called $Greet_content() on that array will return an array with references to the three corresponding spans inside those controls. "
                    ]
                },
                " "
            ]
        },
        " ",
        "<p>\nThe QuickUI compiler and framework allow you to use DOM IDs to easily bridge the\ntwo different namespaces of DOM elements and JavaScript functions. If you create\nan element with id=\"foo\", you'll end up with a function called $foo() that lets\nyou quickly and safely retrieve that element. \n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " It is still possible to obtain a reference to the ",
                {
                    control: "Tag",
                    content: "span"
                },
                ", for example with jQuery functions like find(\"#Greet_content\"), and there are some cases where that can still be useful. The primary disadvantage of such a run-time search is that the search isn’t guaranteed to find the right element on the right control instance. "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                " There’s no semantic value to the identifier \"Greet_content\" — we could have called it anything — but including the class name in the identifier simplifies debugging. If we need to examine the DOM at run time, it’ll be clear what role the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " is playing and which class put that element there. "
            ]
        },
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section05",
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

