//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: " Hello, world! "
});

//
// Page01
//
var Page01 = MarkupAreaPage.subclass({
    className: "Page01",
    title: "Hello, world",
    content: [
        " ",
        "<p>\n    This tutorial walks quickly through the construction of a simple QuickUI control,\n    touching on the framework’s fundamental capabilities.\n</p>",
        " ",
        "<h2>Setting up</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " You can ",
                {
                    control: "Link",
                    href: "/downloads",
                    content: "download QuickUI"
                },
                " and then follow along yourself, or you can read through this first to get a feel for what it’s like to develop in QuickUI. "
            ]
        },
        " ",
        "<p>\n    If you do want to build the sample as you read along, first do the following:\n    <ol>\n        <li>Create a new folder called “demo” for your QuickUI project.</li>\n        <li>\n            Copy the core QuickUI library quickui.js into the demo folder.\n            (You can find quickui.js in the folder where you installed QuickUI,\n            inside the /lib subfolder).\n        </li>\n    </ol>\n</p>",
        " ",
        "<h2>Creating a Quick markup file</h2>",
        " ",
        "<p>\n    Let’s begin with a minimal QuickUI control. Enter the following Quick markup into a\n    new file called Greet.qui and save it in the “demo” folder. (You can copy and paste the text below,\n    or grab the file by clicking the link to the original source code.)\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        {
            html: "<p />",
            content: [
                " This defines a QuickUI control called “Greet”. It does very little: it will cause a fixed text string to be substituted wherever the tag ",
                {
                    control: "Tag",
                    content: "Greet"
                },
                " is found in Quick markup. It can also be invoked with JavaScript in a regular HTML file. In this capacity, it can function as a simple HTML macro. "
            ]
        },
        " ",
        "<h2>Compiling the control</h2>",
        " ",
        "<p>\n    If the above Quick markup is stored in a file named Greet.qui, then it can be compiled\n    with qb, the build tool. Qb compiles sets of Quick markup files into JavaScript and CSS\n    files. The qb build tool invokes a more elemental Quick markup compiler    called qc,\n    which operates on individual files. The qc compiler can be invoked directly if you want\n    to integrate QuickUI into an existing build process.)\n</p>",
        " ",
        "<p>    \n    The simplest way to use the qb build tool is to invoke it from the command line\n    in the same directory where your Quick markup file(s). In the example below,\n    qb is invoked in a folder called “demo” containing Greet.qui. (For convention’s sake,\n    the terminal sessions shown throughout this tutorial are represented in Unix fashion.\n    Results across all supported operating systems are essentially identical.)\n</p>",
        " ",
        "<pre>\n$ <b>qb</b>\nGreet.qui\ndemo.js\ndemo.css\n$ \n</pre>",
        " ",
        "<p>\n    The qb output above indicates that a single Quick markup file, Greet.qui, was found\n    and compiled. As a result of this build pass, two project output files were created:\n    demo.js and demo.css. (The name for this project was assumed from the name of the folder,\n    “demo”.) These project outputs respectively contain the generated JavaScript and CSS for\n    the project.\n</p>",
        " ",
        "<h2>Incremental project builds</h2>",
        " ",
        "<p>\n    The qb build tool is an incremental build tool, so invoking it once more has no effect\n    until you modify Greet.qui again.\n</p>",
        " ",
        "<pre>\n$ <b>qb</b>\n$ \n</pre>",
        " ",
        "<p>\n    The qb tool stores intermediate compiled files in a subfolder it creates called “build”.\n    This folder contains two files for each Quick markup file in the project:\n</p>",
        " ",
        "<pre>\n$ <b>ls build</b>\nGreet.css    Greet.js\n$ \n</pre>",
        " ",
        "<p>\n    From Greet.qui, the qc compiler generated both the JavaScript in Greet.js and the\n    CSS in Greet.css. (Our Greet control does not yet contain styling, so Greet.css\n    is empty for now.) All the intermediate .js and .css files in the build subfolder\n    are concatenated to create the overall project outputs, demo.js and demo.css\n</p>",
        " ",
        "<h2>Instantiating the control</h2>",
        " ",
        "<p>\n    Once the project has built with the qb build tool, the generated project output files\n    can be included in an HTML page. Create a new html file called demo.html with the\n    following contents:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "demo.html"
        },
        " ",
        "<p>\n    This demo.html file references three required JavaScript files: the jQuery library\n    which the QuickUI framework depends upon, the core QuickUI library quickui.js, and the generated\n    demo.js file we generated above. As a preemptive measure, demo.html also includes a\n    reference to the stylesheet demo.css, although that file is empty for now.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " The ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag above uses the jQuery function $() to run code when the document is loaded. That code invokes a QuickUI jQuery plugin called $.control(), which takes care of the details of creating an instance of our new Greet control. Here it will turn the page's ",
                {
                    control: "Tag",
                    content: "body"
                },
                " into an instance of Greet. "
            ]
        },
        " ",
        "<h2>Viewing the result</h2>",
        " ",
        "<p>\nIf you now open demo.html in a web browser, you should\nsee output which looks like this:\n</p>",
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
        "<p>\nNote: The output above is not baked into the text of this page—it’s the live output of an\ninstance of the Greet control. The remaining examples throughout this tutorial are also\nlive code.\n</p>",
        " ",
        "<p>\nAs with any user interface framework, we’ve had to jump through a number of hoops\nto produce a trivial result, but now we’ve laid the foundation for more complex results.\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section02",
            content: "Next >"
        },
        " "
    ]
});

