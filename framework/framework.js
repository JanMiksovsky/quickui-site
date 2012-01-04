//
// TutorialPage
//
TutorialPage = SitePage.subclass({
    name: "TutorialPage",
    navigationLinks: [
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/",
            content: "Introduction"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/contextIndependent.html",
            content: "Context independence"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/definedByClasses.html",
            content: "Control classes"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/inheritFromJQuery.html",
            content: "Inheriting from jQuery"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/content.html",
            content: "Control content"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/properties.html",
            content: "Control properties"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/casting.html",
            content: "Casting jQuery objects"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/controlsFromElements.html",
            content: "Using existing elements"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/cssClasses.html",
            content: "CSS class names"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/manipulatingArrays.html",
            content: "Control arrays"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/eventHandlers.html",
            content: "Handling events"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/metaControls.html",
            content: "Meta-controls"
        },
        " ",
        {
            control: "Link",
            href: "/framework/usingControls/rehydration.html",
            content: "Controls in static HTML"
        },
        " "
    ],
    content: [
        " ",
        " ",
        {
            html: "<div />",
            id: "TutorialPage_content"
        },
        " ",
        {
            control: "CodeEditor",
            id: "editor"
        },
        " ",
        {
            control: "SiteButton",
            id: "buttonNext",
            content: "Next »"
        },
        " "
    ]
});
TutorialPage.prototype.extend({
    
    content: Control.chain( "$TutorialPage_content", "content" ),
    
    initialize: function() {
        
        this._super();
        
        var self = this;
        this.$buttonNext().click( function() {
            var nextPage = self.nextPage();
            if ( nextPage ) {
                window.location = nextPage;
            }
        });
        
        var code = $.trim( $( "script#demo" ).html() );
        this.$editor().code( code );
    },
    
    javascriptFile: Control.property( function( path ) {
        var self = this;
        $.get( path )
            .success( function( data) {
                self.$editor().code( data );
            });
    }),
    
    nextPage: Control.property( function( nextPage) {
        this.$buttonNext().css( "display", nextPage ? "inline-block": "none" );
    })

});

/*
 * The tutorial demo scripts depend upon an element being defined called
 * "$demo". Since the demo script will actually execute when the page is
 * loaded, we define a dummy $demo element which the demo script can
 * manipulate. This will have no effect, so the script won't throw an
 * exception. Later, when the script is run, a closure will define a
 * separate identifier called $demo that will point at the demo element which
 * the script can safely modify.
 */
var $demo = $();

