//
// CodeEditor
//
CodeEditor = Control.subclass({
    name: "CodeEditor",
    content: [
        " ",
        {
            html: "<div />",
            id: "CodeEditor_content"
        },
        " ",
        {
            html: "<div />",
            id: "toolbar",
            content: [
                " ",
                {
                    control: "BasicButton",
                    id: "buttonRun",
                    content: "Run"
                },
                " "
            ]
        },
        " ",
        {
            html: "<textarea class=\"pane\" />",
            id: "CodeEditor_dom"
        },
        " ",
        {
            html: "<textarea class=\"pane\" />",
            id: "CodeEditor_code"
        },
        " ",
        {
            html: "<div class=\"pane\" />",
            id: "result"
        },
        " "
    ]
});
CodeEditor.prototype.extend({
    
    dom: Control.chain( "$CodeEditor_dom", "content" ),
    code: Control.chain( "$CodeEditor_code", "content" ),
    content: Control.chain( "$CodeEditor_content", "content" ),
    
    initialize: function() {
        
        var self = this;
        this.$buttonRun().click( function() { self.run(); } );
        
        this.$CodeEditor_dom().content( "<div id='foo'/>")
        this.$CodeEditor_code().content( "$('#foo').text('Hello, world');" );
    },
    
    result: Control.chain( "$result", "content" ),
    
    run: function() {
        this.$result().html( this.dom() );
        eval( this.code() );
    }
    
});

//
// TutorialPage
//
TutorialPage = SitePage.subclass({
    name: "TutorialPage",
    content: [
        " ",
        {
            control: "CodeEditor",
            content: " Here's a sample step introduction. "
        },
        " "
    ]
});

