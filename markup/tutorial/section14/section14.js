//
// Greet
//
var Greet = Control.subclass({
    className: "Greet",
    content: [
        " Hello, ",
        {
            html: "<span class=\"enabled\" />",
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
    enabled: Control.chain( "$Greet_content", "applyClass/enabled" ),
    punctuation: Control.chain( "$Greet_punctuation", "content" ),
    text: Control.chain( "$Greet_content", "text" ),

    initialize: function() {
        var self = this;
        this.$Greet_content().click(function() {
            if ( self.enabled() ) {
                var newName = prompt( "Enter name:", self.text() );
                if ( newName != null ) {
                    self.text( escape( newName ) );
                }
            }
        });
    }
});

//
// Page14
//
var Page14 = MarkupAreaPage.subclass({
    className: "Page14",
    title: "Subclassing controls",
    content: [
        " ",
        "<p>\nIf a particular control class instance — with properties filled out a particular way,\nsay, or with particular styling — is likely to be repeated elsewhere, the instance can itself\nbecome the prototype for a new class of control. This is perhaps the most powerful\naspect of QuickUI, and the most important ingredient in effectively factoring \na UI into classes that can focus on very specific duties. \n</p>",
        " ",
        "<h2>Factoring aspects of a control instance into a new subclass</h2>",
        " ",
        "<p>\nIn our Sample control, the Greet instance with the ID “bob” is a particular\nemphatic greeting, with an exclamation point as punctuation, and bold red styling.\nWe can lift out these aspects and create a new subclass of Greet called\nEmphaticGreet (and stored in EmphaticGreet.qui):\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "EmphaticGreet.qui"
        },
        " ",
        {
            html: "<p />",
            content: [
                " This control doesn’t define a ",
                {
                    control: "Tag",
                    content: "content"
                },
                " tag. Instead it uses a tag we haven’t seen yet: a ",
                {
                    control: "Tag",
                    content: "prototype"
                },
                ". A control class’ ",
                {
                    control: "Tag",
                    content: "prototype"
                },
                " identifies an object that will created to serve as the prototype or starting point for new instances of Greet. If no prototype is specified, the default prototype is the base Control class. The Quick markup above overrides this default behavior, and specifies that new instances of the EmphaticGreet class should be created by first instantiating the Greet class. The generated code for EmphaticGreet will see to it that EmphaticGreet.prototype = new Greet(). "
            ]
        },
        " ",
        "<p>\nA QuickUI prototype goes beyond the behavior of a normal JavaScript prototype in that\nit can also indicate a set of default property values that should be set on new\ncontrol instances. Here this includes setting a new control’s punctuation property to \"!\".\n</p>",
        " ",
        "<p>\nThe above definition for EmphaticGreet does not define a content property, so it\ninherits the one defined for Greet. It also inherits all the behavior of Greet,\nincluding the click-to-edit behavior.\n</p>",
        " ",
        "<h2>Using the new subclass</h2>",
        " ",
        "<p>\nHaving factored out this emphatic behavior into own class, we can apply that class to the\noriginal “bob” control element, and simplify the definition of the Sample control. Let’s\nalso add an additional instance of the EmphaticGreet class at the end:\n</p>",
        " ",
        {
            control: "SourceFileContents",
            path: "Sample.qui"
        },
        " ",
        "<p>\nAll instances of our new EmphaticGreet class receive the same styling and content\n(the exclamation mark as punctuation):\n</p>",
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
        "<p>\nSignificantly, we’re deriving behavior here, not copying and pasting it. If we make further\nmodifications to the Greet class, those will be automatically picked up by the EmphaticGreet\nclass.\n</p>",
        " ",
        "<h2>Conclusion</h2>",
        " ",
        "<p>\nThis concludes this introduction to some of the features of QuickUI. The samples shown here\nare just toys, but they illustrate how QuickUI extends the same benefits of modular,\nobject-oriented development to the realm of user interfaces created with standard web\ntechnologies: HTML, CSS, and JavaScript.\n</p>",
        " ",
        {
            html: "<p />",
            content: [
                {
                    control: "Link",
                    href: "/downloads",
                    content: "Download QuickUI"
                }
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                {
                    control: "Link",
                    href: "/catalog",
                    content: "Explore the QuickUI Catalog of ready-to-use controls"
                }
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                {
                    control: "Link",
                    href: "/docs",
                    content: "Read the framework docs"
                }
            ]
        },
        " ",
        {
            html: "<p />",
            content: [
                {
                    control: "Link",
                    href: "/home",
                    content: "Return to Home"
                }
            ]
        },
        " ",
        {
            control: "AddThis"
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
            control: "EmphaticGreet",
            content: "Bob"
        },
        " ",
        {
            control: "Greet",
            punctuation: "?",
            enabled: "false",
            content: " <i>Carol</i> "
        },
        " ",
        {
            control: "EmphaticGreet",
            content: "David"
        },
        " "
    ]
});

//
// EmphaticGreet
//
var EmphaticGreet = Greet.subclass({
    className: "EmphaticGreet",
    punctuation: "!"
});

