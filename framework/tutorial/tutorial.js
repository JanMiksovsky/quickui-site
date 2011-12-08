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
        " ",
        {
            html: "<div />",
            id: "CodeEditor_error"
        },
        " "
    ]
});
CodeEditor.prototype.extend({
    
    // dom: Control.chain( "$CodeEditor_dom", "content" ),
    code: Control.chain( "$CodeEditor_code", "content" ),
    content: Control.chain( "$CodeEditor_content", "content" ),
    error: Control.chain( "$CodeEditor_error", "content" ),
    
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
        
        this.error( null );
        
        this.$result().html( "<div id='demo'/>" );
        try {
            eval( this.code() );
        }
        catch ( error ) {
            this.error( error.toString() );
        }
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

