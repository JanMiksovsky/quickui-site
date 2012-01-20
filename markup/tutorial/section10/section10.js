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
// Page10
//
var Page10 = MarkupAreaPage.subclass({
    className: "Page10",
    title: "Styling controls",
    content: [
        " ",
        "<h2>Styling a control element</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " Our two controls, Greet and Sample, have to this point accepted whatever default formatting is provided by the browser. You can define formatting for a control through the addition of a ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag, much as you can in HTML: "
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
                " When the control is built, the qc compiler will extract the contents of the ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag and emit a standard CSS file to hold those style rules: "
            ]
        },
        " ",
        "<pre>\n$ <b>qb</b>\nGreet.qui\ndemo.js\ndemo.css\n$ \n</pre>",
        " ",
        {
            html: "<p />",
            content: [
                " Building the QuickUI project emits build/Greet.css, which gets put into the combined demo.css that holds CSS from all the QuickUI controls in the project. Until now, the file Greet.css was empty, but it will now include the CSS defined in the ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag above. Since we have only defined style information for one control, Greet, for now Greet.css and the combined demo.css will be identical. "
            ]
        },
        " ",
        "<p>\nWe can include the combined demo.css file in our sample HTML page:\n</p>",
        " ",
        "<pre>\n&lt;link rel=\"stylesheet\" type=\"text/css\" href=\"demo.css\" /&gt;\n</pre>",
        " ",
        "<p>\nOpening demo.html now shows the indicated styling applied to the Greet control’s content:\n</p>",
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
        "<p>\nSignificantly, the CSS style rules for this control are bundled right alongside\nthe control’s DOM elements and its JavaScript. This ensures all three aspects of\na control travel together. It also ensures locality of reference: when debugging\na control, it’s a simple matter to look from the DOM elements to the adjacent\nstyle rules or vice versa.\n</p>",
        " ",
        "<h2>Automatic scoping of control styles</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " If we inspect the contents of generated Greet.css file, we can see the ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag contents extracted from Greet.qui — along with a small but important transformation: "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "build/Greet.css"
        },
        " ",
        "<p>\nThe original CSS rule for #Greet_content has been prepended with a reference to the\nelement class “.Greet”. The result of this transformation is that the CSS rules in\nGreet.css will only apply to DOM elements with the class “Greet”.\n</p>",
        " ",
        "<p>\nEarlier it was mentioned that the top-level element of an instantiated QuickUI control\nwill include the name of the control’s class and the names of all its parent classes.\nFor reference, the run-time DOM for a Greet control now looks something like:\n</p>",
        " ",
        "<pre>\n&lt;div class=\"Greet Control\"&gt;\n    Hello,\n    &lt;span id=\"Greet_content\"&gt;Alice&lt;/span&gt;\n    &lt;span id=\"Greet_punctuation\"&gt;.&lt;/span&gt;\n&lt;/div&gt;\n</pre>",
        " ",
        "<p>\nBecause the above CSS rule begins with “.Greet”, the rule can be generally expected to\nonly apply within the DOM for a Greet control. If another DOM element on the page\nhappened to have the ID “Greet_content”, the rule is unlikely to fire.\n</p>",
        " ",
        "<p>\nThis scoping is not bullet-proof. If a control itself contains complex HTML content,\nand that content includes an element that matches the CSS rule, the styling would be\napplied to that element as well. This is largely a theoretical weakness, and doesn’t\narise often in practice. (One special case is a control instance that hosts another\ninstance of the same control class. Both will include elements with the same IDs,\nso the CSS will apply to both. However, in such cases it is generally desired to\napply the same formatting to both, so the end result is usually acceptable.)\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section11",
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
            punctuation: "?",
            content: " <i>Carol</i> "
        },
        " "
    ]
});

