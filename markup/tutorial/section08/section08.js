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
// Page08
//
var Page08 = MarkupAreaPage.subclass({
    className: "Page08",
    title: "Markup within properties",
    content: [
        " ",
        "<p>\nThe control property values we’ve used so far have only been strings: “Alice”, “!”, etc.\nQuickUI markup also allows the use of full HTML to be used in setting a property value.\nSince XML tag attributes are limited to strings, we’ll need to use different markup\nsyntax to set properties to arbitrary HTML.\n</p>",
        " ",
        "<h2>Three different ways to set control properties</h2>",
        " ",
        "<p>\nQuick markup provides three ways of setting a control property:\n</p>",
        " ",
        "<ol>\n\n<li>\nSetting an attribute on the control’s tag. This is what we’ve done in the examples so far.\n<pre>\n&lt;Greet content=\"Alice\" /&gt;\n</pre>\n\n</li>\n\n<li>\nUsing a property tag. We create a new tag inside of the control tag, and give the interior\ntag the name of the property we want to set. (Take care to give the name of the property\ntag an initial lowercase letter so the qc compiler will recognize it as a property tag.)\n<pre>\n&lt;Greet&gt;\n    &lt;content&gt;\n        Alice\n    &lt;/content&gt;\n&lt;/Greet&gt;\n</pre>\nThe elements within the property tag can be a simple string, or arbitrarily complex\nQuick markup—any mixture of HTML and additional QuickUI controls.\n</li>\n\n<li>\nSetting the inner content of a control tag to the desired value of the control’s content()\nproperty. Setting the control’s content is such a common scenario that Quick markup provides\na concise syntax for setting it. Any elements nested inside a control tag (and which are\noutside of the scope of property tags as described above) are passed to the control’s\ncontent() property function. In other words, the content property is the default property\nthat is set when no other property is specified.\n\n<pre>\n&lt;Greet&gt;\n    Alice\n&lt;/Greet&gt;\n</pre>\n\nNote that QuickUI doesn’t define a standard <i>meaning</i> for the special content()\nproperty; QuickUI simply defines a convenient way of setting it. Since you can only define\none content property per control, you should consider which of the control’s properties\nis really it’s core “content”. In the case of our Greet control, it seems reasonable\nto treat the name used by the control as the control's core content.\n\n</li>\n\n</ol>",
        " ",
        "<p>\nAll three of the above mechanisms produce the same result. The first option can only accept\nstring values. The last two can both accept arbitrary complex QuickUI markup. The last option\ncan only be used to set the special property called “content”.\n</p>",
        " ",
        "<p>\nUsing more than one of the above methods is used to assign multiple values to the same\nproperty is legal (but discouraged). The assignments will be made in the order numbered\nabove. Content specified via method two will overwrite that specified by method one,\nand similarly method three overwrites content specified by method two.\n</p>",
        " ",
        "<h2>Using Quick markup in property values</h2>",
        " ",
        "<p>\nWe can now apply the above knowledge to our controls.\nUntil now, our sample Greet control has styled the designated name content in italics.\nRather than baking italics into the control, we can let the control caller decide when\nand where italics are appropriate. First, we’ll remove the italics from the Greet control:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Greet.qui"
        },
        " ",
        "<p>\nNext, we’ll rewrite the Sample control to set the content of the various Greet instances\nusing the property tag syntax. And let’s take advantage of the ability to embed arbitrary\ncontent by setting just the name of the third Greet instance in italics:\n</p>",
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
        "<h2>Factoring a user interface with QuickUI</h2>",
        " ",
        "<p>\nThe flexibility of arbitrary markup in property values allows you to build very rich\ncontrols. Each control on the page can focus on a very particular set of responsibilities,\nand leave the rest of the presentation to consumers of the control.\n</p>",
        " ",
        "<p>\nThis is nothing more or less than applying good principles of code factoring\nto a user interface. Above we rewrote our Greet control to factor out the hard-coded\nitalic presentation and focus the Greet control just on simply displaying content according\nto a very simple template. We then worked that italic presentation into just one instance\nof the Greet control where we felt we really wanted it.\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section09",
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

