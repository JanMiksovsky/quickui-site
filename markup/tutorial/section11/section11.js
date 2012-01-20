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
// Page11
//
var Page11 = MarkupAreaPage.subclass({
    className: "Page11",
    title: "More on styling",
    content: [
        " ",
        "<h2>Styling the top level of a control</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " In the previous example, we applied styling just to a single ",
                {
                    control: "Tag",
                    content: "span"
                },
                " within a Greet instance. If we want the styling to apply to the entire control, we can remove the ID reference from the rule in the ",
                {
                    control: "Tag",
                    content: "style"
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
        "<p>\nThis style rule is not a legal CSS rule on its own, but will get transformed into:\n</p>",
        " ",
        "<pre>\n.Greet {\n    font-family: Arial, Helvetica, sans serif;\n    font-size: 11pt;\n}\n</pre>",
        " ",
        "<p>\nThe above CSS <i>is</i> legal, and will apply the styling to the control’s outermost\nelement and everything it contains.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                " In general, all CSS rules enclosed in a QuickUI control’s ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag will have the control’s class name prepended to it. One exception: if a CSS rule already begins with the control’s class name, then the qc compiler leaves the rule as is. "
            ]
        },
        " ",
        "<h2>Styling a control instance</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " In addition to having a control class define its own styles, we can style a specific control from the outside using normal CSS rules. We can have our Sample control assign an ID to a specific Greet instance, and then Sample can style that instance in a ",
                {
                    control: "Tag",
                    content: "style"
                },
                " tag of its own. As before, we’ll also take this opportunity to wrap the Sample control’s prototype in a ",
                {
                    control: "Tag",
                    content: "prototype"
                },
                " tag. "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nNow all Greet instances appear in the desired font, and the middle Greet instance\nreceives extra styling:\n</p>",
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
                " This is possible because an “id” attribute on the control instance (here, Greet) will get transferred to the control’s outer ",
                {
                    control: "Tag",
                    content: "div"
                },
                ", allowing normal CSS rules to work. Similarly, any “class” attribute specified on a control instance will get included in the control’s outer element as well. "
            ]
        },
        " ",
        "<h2>Considerations when styling control instances from the “outside”</h2>",
        " ",
        "<p>\nCare must be taken when you have one control extensively styling the controls it contains,\nbecause this can lead to undesirable dependencies between the controls. Because there’s\nno way for a DOM element to hide its contents, it can be all too tempting to have the outer\ncontrol exploit knowledge of how a contained control is built. For example, \nnothing to prevent the Sample control from specifing a CSS rule that applies an element within\nGreet like Greet_content. Such a dependency can produce issues if the Greet control is\nlater modified to store its content differently.\n</p>",
        " ",
        "<p>\nAs a general guideline, it’s often acceptable to let an outer control override a control’s\nstyling through general CSS attributes like font-family and color which are set on the\ninner control’s topmost element (as shown above). Beyond that, if a need arises to style\nspecific elements within a control, it’s usually better to let the control style itself.\nThe control might support different appearances by exposing properties specifically intended\nto alter its appearance, which preserves both flexibility and maintainability.\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section12",
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
            content: " <i>Carol</i> "
        },
        " "
    ]
});

