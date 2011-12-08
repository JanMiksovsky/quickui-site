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
                " (Ctrl+Enter) "
            ]
        },
        " ",
        {
            html: "<div />",
            id: "runner",
            content: [
                " ",
                {
                    html: "<div />",
                    content: [
                        " ",
                        {
                            html: "<textarea class=\"pane\" />",
                            id: "CodeEditor_code"
                        },
                        " "
                    ]
                },
                " ",
                {
                    html: "<div class=\"pane\" />",
                    id: "result"
                },
                " "
            ]
        },
        " "
    ]
});
CodeEditor.prototype.extend({
    
    // dom: Control.chain( "$CodeEditor_dom", "content" ),
    code: Control.chain( "$CodeEditor_code", "content" ),
    content: Control.chain( "$CodeEditor_content", "content" ),
    
    initialize: function() {
        
        var self = this;
        this.$buttonRun().click( function() { self.run(); } );
        
        //this.$CodeEditor_dom().content( "<div id='demo'/>" );
        this.$CodeEditor_code().content( "$('#demo').text('Hello, world');" );
        
        this.inDocument( function( $control ) {
            $control.run();
        });
    },
    
    result: Control.chain( "$result", "content" ),
    
    run: function() {
        this.$result().html( "<div id='demo'/>" );
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

