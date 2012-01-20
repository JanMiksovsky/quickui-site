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
// Page05
//
var Page05 = MarkupAreaPage.subclass({
    className: "Page05",
    title: "Defining control properties",
    content: [
        " ",
        {
            html: "<p />",
            content: [
                " Now that we can obtain a reference to the ",
                {
                    control: "Tag",
                    content: "span"
                },
                " element within our Greet control, we can expose that element’s contents directly as a property of the Greet class. This lets people who want to use the Greet control manipulate it without having to understand the details of its underlying construction. "
            ]
        },
        " ",
        "<h2>Defining control behavior with script</h2>",
        " ",
        {
            html: "<p />",
            content: [
                " QuickUI controls use native JavaScript to define properties. Quick markup affords a convenient place to put this code: embed it directly in the markup inside a ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag, as in normal HTML. "
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
                " The qc compiler leaves the contents of a control’s ",
                {
                    control: "Tag",
                    content: "script"
                },
                " tag untouched, and simply appends the tag’s contents to the bottom of the generated JavaScript output, as shown below. (QuickUI can also be used with a “code behind” approach, described later.) "
            ]
        },
        " ",
        {
            control: "SourceFileContents",
            path: "build/Greet.js"
        },
        " ",
        "<h2>Two approaches to writing JavaScript for a control</h2>",
        " ",
        "<p>\nThe small bit of JavaScript for our Greet control above was embedded directly in Quick markup.\nThis is one of two approaches to defining control behavior with JavaScript:\n</p>",
        " ",
        "<ol>\n    <li>\n        Embed the JavaScript in the Quick markup file (as shown above). This approach simplifies maintenance,\n        as the markup and its accompanying code travel together. The disadvantage is that the embedded code\n        will end up getting copied into the generated JavaScript file, which will complicate debugging.\n    </li>\n    <li>\n        Put a control's JavaScript in a separate .js file. This is called the \"code behind\" approach.\n        The advantage of this approach is that you can debug the JavaScript as you would any other code.\n        The disadvantages are that the control and its associated JavaScript will live in separate files,\n        complicating maintenance; you'll also have more .js dependencies to track and reference in HTML files.\n    </li>\n</ol>",
        " ",
        "<h2>Control properties as setter/getter functions</h2>",
        " ",
        "<p>\nThe code above uses a jQuery-flavored approach to defining control properties, but JavaScript is a dynamic\nlanguage and many alternative routes are possible. Some notes on the particular choices made here:\n</p>",
        " ",
        {
            html: "<ul />",
            content: [
                " ",
                "<li>\n        Here the code calls extend() utility function inherited from jQuery\n        (remember, Greet ultimately inherits from jQuery)\n        to add a property to the Greet class by modifying the class’ prototype.\n        As we add more properties, the extend() approach is very compact.\n    </li>",
                " ",
                "<li>\n        Also following jQuery convention, QuickUI control classes generally define properties as setter/getter functions.\n        These are functions that accept a single value. If the value is undefined (missing), the function call behaves as\n        a getter, and returns the current value of the property. If the function call includes a value, the function sets\n        the property to that value.\n    </li>",
                " ",
                "<li>\n        The getter function returns the value on the first element.\n        The setter function returns \"this\" to support jQuery-style chaining.\n    </li>",
                " ",
                {
                    html: "<li />",
                    content: [
                        " In this particular property example, we’re defining a property called “content” that will form the significant chunk of the control’s DOM. The easiest way to store this property is in the DOM itself, directly delegating responsibility for getting and setting the property value to the jQuery html() function. That particular function gets or sets the inner HTML for an element. Here it will get or set the inner HTML for the ",
                        {
                            control: "Tag",
                            content: "span"
                        },
                        " tag using the reference we defined in the Quick markup. "
                    ]
                },
                " "
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                " Because JavaScript does not (easily) allow data hiding, our new Greet.content() function doesn’t permit or deny any operation that couldn’t be achieved through direct access of the control’s DOM. However, by defining our content property this way, we’ve taken a significant step towards making the control more modular. Our content function is already a more convenient way of getting and setting the control’s content, so if for no other reason, consumers of the control will be more inclined to access the property that way. And by decoupling specification of the control content from the underlying DOM element, we open up the possiblity that, in the future, we might decide to change how the content is storred. Above, the Greet.content() function internally stashes the property value in a ",
                {
                    control: "Tag",
                    content: "span"
                },
                ", but this could later be changed to a ",
                {
                    control: "Tag",
                    content: "div"
                },
                ", some other HTML element, or some other storage mechanism altogether. Code that calls that function shouldn’t need to know or care how the data is stored, so long its storage semantics are consistent. "
            ]
        },
        " ",
        "<p>\nThe specific name “content” is the standard name for the property on a QuickUI control that\nholds the control’s core variable content. We could just as easily have called the\nproperty “foo”, and most of the above would still hold true. It turns out, as we’ll see\nin a minute, that the property called “content” has a specific meaning to the qc compiler\nthat is useful in setting control content.\n</p>",
        " ",
        {
            control: "Link",
            href: "/markup/tutorial/section06",
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

