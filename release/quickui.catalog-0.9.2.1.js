/* This file exists so we can work a version number into the catalog. */
var _Version = Control.sub({
    className: "_Version"
});
_Version.prototype.extend({
	catalog: "0.9.2.1"
});

/*
Shows a placeholder for a standard IAB ad unit.
The size can be specified with either pixel dimensions or a unit name.
See IAB "Ad Unit Guidelines" at http://www.iab.net for dimensions and names.
*/
var AdPlaceholder = Control.sub({
    className: "AdPlaceholder",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "container",
                content: [
                    " ",
                    {
                        html: "<div>Advertisement</div>",
                        ref: "label"
                    },
                    " ",
                    {
                        html: "<div />",
                        ref: "AdPlaceholder_content"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "true"
    }
});
AdPlaceholder.prototype.extend({
    
    /*
     * Ad unit content. By default, this shows the unit/dimensions.
     */
    content: Control.chain( "$AdPlaceholder_content", "content" ),
    
    /*
     * Ad unit dimensions. Should include two values separated by an "x",
     * e.g., "300 x 250". Can also be one of the following ad unit names:
     * 
     *      Medium Rectangle
     *      Rectangle
     *      Leaderboard
     *      Wide Skyscraper
     *      Half Page Ad
     *      Button 2
     *      Micro Bar
     */
    dimensions: Control.property( function( dimensions ) {
        
        var s = AdPlaceholder.standardUnits[ dimensions ] || dimensions;
        var parts = s.toLowerCase().split( "x" );
        var width = parseInt( parts[0] );
        var height = parseInt( parts[1] );
        
        this
            .css({
                    height: height,
                    "min-height": height,
                    "min-width": width,
                    width: width
            })
            .content( width + " x " + height )
            .checkForSizeChange();
            
    }),

    initialize: function() {
        if ( !this.dimensions() ) {
            // Use default size.
            this.dimensions( "300 x 250" );
        }
    }

});

// Class methods
AdPlaceholder.extend({
    
    /*
     * Names of all core standard ad units as of 2/28/2011.
     * See http://www.iab.net/iab_products_and_industry_services/1421/1443/1452
     */
    standardUnits: {
        "Medium Rectangle": "300 x 250",
        "Rectangle": "180 x 150",
        "Leaderboard": "728 x 90",
        "Wide Skyscraper": "160 x 600",
        "Half Page Ad": "300 x 600",
        "Button 2": "120 x 60",
        "Micro Bar": "88 x 31"
    }
});

/* Render a JavaScript array as a table. */
var ArrayTable = Control.sub({
    className: "ArrayTable"
});
ArrayTable.prototype.extend({
    
    /*
     * The array-of-arrays to show as the control's content.
     * 
     * A row will be created for each outer array item, and a cell for each item
     * in the inner arrays.
     */
    content: Control.property( function( outerArray ) {
        var rows = $.map( outerArray, function( innerArray, index ) {
            var cells = $.map( innerArray, function( item, index ) {
                return Control( "<div/>" ).content( item );
            });
            var row = $( "<div/>" );
            row.append.apply( row, cells );
            return row;
        });
        Control( this ).content( rows );  
    })
    
});

/*
A text box that makes itself big enough to show its content.
This works by copying the text to a hidden div which will automatically grow in size;
the expanding copy will expand the container, which in turn stretch the text box.
*/
var AutoSizeTextBox = Control.sub({
    className: "AutoSizeTextBox",
    inherited: {
        content: [
            " ",
            /* Visible text box */
            " ",
            {
                html: "<textarea />",
                ref: "textBox"
            },
            " ",
            /* Hidden copy of text. Use a pre tag to preserve line breaks, entities, etc. */
            " ",
            {
                html: "<pre />",
                ref: "textCopy"
            },
            " "
        ]
    }
});
AutoSizeTextBox.prototype.extend({

    /*
     * Resize the text box to exactly contain its content.
     */
    autoSize: Control.iterator( function( addExtraLine ) {

        /*
         * We resize by copying the text box contents to the hidden copy.
         * That copy will size appropriately, which will make the overall control
         * the right height, which will then size the text box.
         */
        var content = this.$textBox().content();
        
        if ( addExtraLine ) {
            content += "\n";
        }
        
        // See if last line of content ends in a newline (extra or otherwise).
        if ( content.slice( -1 ) === "\n" ) {
            // Add an extra space so that the last line will get fully rendered.
            content += " "; 
        }
        
        this.$textCopy().text( content );
    }),
    
    /*
     * The content of the text box.
     */
    content: Control.chain( "$textBox", "content", function() {
        this.autoSize();
    }),
    
    initialize: function() {
        
        var self = this;
        this.$textBox().on({
            "change keyup": function( event ) {
                self.autoSize();
            },
            keypress: function( event ) {
                if ( event.which === 13 /* Enter */ ) {
                    // Speculatively add a line to our copy of the text.
                    /*
                     * We're not sure what the exact effect of typing this
                     * character will be, and at this point it's not reflected
                     * yet in the text box's content. We speculate that it
                     * will add a line to the text and size accordingly.
                     * (One other possibility is that the user's replacing
                     * a selected chunk of text with a newline.) In any event,
                     * once we get the keyup or change event, we'll make any
                     * final adjustments.
                     */
                    self.autoSize( true );
                }
            }
        });
        
        this.inDocument( function() {
            this._refresh();
        });
    },
    
    /*
     * The minimum number of lines that should be shown. By default, this is 1.
     * Setting this to a higher number will ensure an empty textarea is still
     * multiple lines tall, which lets the user intuit that the control accepts
     * multiple lines of text.
     */
    minimumLines: Control.property.integer( function( minimumLines ) {
        if ( this.inDocument() ) {
            this._refresh();
        }
    }, 1 ),

    /*
     * The placeholder (hint text) shown in the text area if it's empty.
     */
    placeholder: Control.chain( "$textBox", "prop/placeholder" ),
    
    /*
     * True if the text box should expose the browser's built-in spell-checking.
     */
    spellcheck: Control.chain( "$textBox", "prop/spellcheck" ),
    
    // For the following, we need to wait until the control's in the DOM.    
    _refresh: Control.iterator( function() {

        var $textBox = this.$textBox();
        var $textCopy = this.$textCopy();
        
        // Copy the control's font to the textarea and text copy.
        // This ensures both end up with the same text metrics.
        this.children().css({
            "font-family": this.css( "font-family" ),
            "font-size": this.css( "font-size" ),
            "font-style": this.css( "font-style" ),
            "font-weight": this.css( "font-weight" )
        });

        // Try to get the text box's line height. Unfortunately some browsers
        // return the useful value "normal", in which case we have to make
        // an estimate based on font size.
        var lineHeight = parseInt( $textBox.css( "line-height" ) );
        if ( isNaN( lineHeight ) ) {
            // line-height values like "normal" don't give us a measurement
            // we can use. We fall back to estimating a line height
            // based on font size. We then apply this to both the text box
            // and the copy so they both have the same font-size.
            lineHeight = Math.floor( parseInt( $textBox.css( "font-size" ) ) * 1.25 );
            $textBox.css( "line-height", lineHeight + "px" );
        } 
        $textCopy.css( "line-height", lineHeight + "px" );
        
        // Mirror the textarea's padding and borders on the text copy.
        var borderBottomWidth = $textBox.css( "border-bottom-width" );
        var borderLeftWidth = $textBox.css( "border-left-width" );
        var borderRigthWidth = $textBox.css( "border-right-width" );
        var borderTopWidth = $textBox.css( "border-top-width" );
        var paddingBottom = $textBox.css( "padding-bottom" );
        var paddingLeft = $textBox.css( "padding-left" );
        var paddingRight = $textBox.css( "padding-right" );
        var paddingTop = $textBox.css( "padding-top" );
        if ( $.browser.mozilla && !$textBox.is(":visible") ) {
            // Firefox incorrectly reports the default padding for hidden textareas
            // as 0px. If the textarea is visible, or the padding has been explicitly
            // set, the reported padding is correct. But if we're dealing with a
            // textarea that's currently hidden in Firefox, and the reported padding
            // all around is 0px, we assume we've hit the Firefox padding bug and
            // assume the actual default padding of 2px instead.
            if ( paddingBottom === "0px" && paddingLeft === "0px"
                && paddingRight === "0px" && paddingTop === "0px" ) {
                paddingBottom = "2px";
                paddingLeft = "2px";
                paddingRight = "2px";
                paddingTop = "2px";
            }
        }

        $textCopy.css({
            "border-bottom-width": borderBottomWidth,
            "border-left-width": borderLeftWidth,
            "border-right-width": borderRigthWidth,
            "border-top-width": borderTopWidth,  
            "padding-bottom": paddingBottom,  
            "padding-left": paddingLeft,
            "padding-right": paddingRight,
            "padding-top": paddingTop
        });

        var minimumLines = this.minimumLines();
        if ( minimumLines ) {
            
            // Convert the number of lines into a minimum height.
            var height = minimumLines * lineHeight;
            
            // Mozilla incorrectly includes padding+border in height when
            // -moz-box-sizing is border-box. The other browsers do not,
            // so for those browsers we need to add it in.
            if ( !$.browser.mozilla ) {
                height += parseInt( borderTopWidth )
                        + parseInt( paddingTop )
                        + parseInt( paddingBottom )
                        + parseInt( borderBottomWidth );
            }
            
            this.$textCopy().css( "min-height", height + "px" );
        }
    })
    
});

/* Button base class. Handles mouse events, abstract styles. */
var BasicButton = Control.sub({
    className: "BasicButton",
    tag: "button",
    inherited: {
        generic: "true"
    }
});
BasicButton.prototype.extend({
    
    /*
     * The current state of the button. Read-only.
     * This will return one of the following values:
     * 
     *  BasicButton.normal
     *  BasicButton.hover
     *  BasicButton.focus
     *  BasicButton.active
     *  BasicButton.disabled
     */
    buttonState: function() {
        if ( this.disabled() ) {
            return BasicButton.state.disabled;
        } else if ( (this.isMouseButtonDown() && this.isMouseOverControl() )
            || this.isKeyPressed()) {
            return BasicButton.state.active;
        } else if ( this.isFocused() ) {
            return BasicButton.state.focus;
        } else if ( this.isMouseOverControl() )
        {
            return BasicButton.state.hover;
        }

        return BasicButton.state.normal;
    },

    /*
     * True if the button is disabled.
     * 
     * Setting this also applies "disabled" class for IE8, which doesn't support
     * the :disabled pseudo-class.
     */
    disabled: Control.chain( "prop/disabled", function( disabled ) {
        if ( disabled ) {
            // Force removal of interactive states.
            this.removeClass( "active focus hover" );
        }
        this
            .toggleClass( "disabled", disabled )
            ._renderButton();
    }),

    initialize: function() {
        var self = this;
        this
            .on({
                blur: function( event ) { self._trackBlur( event ); },
                focus: function( event ) { self._trackFocus( event ); },
                keydown: function( event ) { self._trackKeydown( event ); },
                keyup: function( event ) { self._trackKeyup( event ); },
                mousedown: function( event ) { self._trackMousedown( event ); },
                mouseup: function( event ) { self._trackMouseup( event ); }
            })
            .hover(
                function( event ) { self._trackMousein( event ); },
                function( event ) { self._trackMouseout( event ); }
            )
            ._renderButton();
    },
    
    /*
     * True if the button currently has the focus.
     */
    isFocused: Control.property.bool( null, false ),
    
    /*
     * True if the user is currently pressing down a key.
     */
    isKeyPressed: Control.property.bool( null, false ),
    
    /*
     * True if the mouse button is currently down.
     */
    isMouseButtonDown: Control.property.bool( null, false ),
    
    /*
     * True if the mouse is currently over the button.
     */
    isMouseOverControl: Control.property.bool( null, false ),

    /*
     * True if the button's "quiet" style should be applied. The generic quiet
     * styling shows no background or border effects in the button's normal
     * state -- only when the user is interacting with the button -- so that
     * the button can more easily blend in as a component of other controls.
     */
    quiet: Control.chain( "applyClass/quiet" ),
    
    _renderButtonState: function( buttonState ) {},
    
    _renderButton: function() {
        this._renderButtonState( this.buttonState() );
    },
    
    _trackBlur: function( event ) {
        this
            .removeClass( "focus" )
            // Losing focus causes the button to override any key that had been active.
            .isKeyPressed( false )
            .isFocused( false )
            ._renderButton();
    },
    
    _trackFocus: function( event ) {
        this
            .addClass( "focus" )
            .isFocused( true )
            ._renderButton();
    },
    
    _trackKeydown: function( event ) {
        if ( event.which === 32 /* Space */ || event.which === 13 /* Enter */ ) {
            this
                .isKeyPressed( true )        
                ._renderButton();
        }
    },
    
    _trackKeyup: function( event ) {
        this
            .isKeyPressed( false )
            ._renderButton();
    },
    
    _trackMousedown: function( event ) {
        this
            .addClass( "active" )
            .isMouseButtonDown( true )
            ._renderButton();
    },
    
    _trackMousein: function( event ) {
        this
            .addClass( "hover" )
            .isMouseOverControl( true )
            ._renderButton();
    },
    
    _trackMouseout: function(event) {
        this
            .removeClass( "focus hover active" )
            .isMouseOverControl( false )
            ._renderButton();
    },
    
    _trackMouseup: function( event ) {
        this
            .removeClass( "active" )
            .isMouseButtonDown( false )
            ._renderButton();
    }

});

/*
 * Class members
 */
BasicButton.extend({
    state: {
        normal: 0,
        hover: 1,
        focus: 2,
        active: 3,
        disabled: 4
    }
});

var Blog = Control.sub({
    className: "Blog",
    inherited: {
        content: [
            " ",
            {
                control: "List",
                ref: "postList",
                itemClass: "BlogPost",
                mapFunction: "entry"
            },
            " "
        ]
    }
});
$.extend(Blog.prototype, {
    
    count: Control.property.integer(),
    
    feed: Control.property(),
    
    initialize: function() {
        this.reload();
    },
    
    itemClass: Control.chain( "$postList", "itemClass" ),
    
    mapFunction: Control.chain( "$postList", "mapFunction" ),
    
    reload: Control.iterator( function() {
        
        if ( !this.feed() ) {
            return;
        }
        
        var url = "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0";
        url += this._urlParam( "q", this.feed() );
        url += this._urlParam( "num", this.count() );
        url += this._urlParam( "callback", "?" );
        
        var self = this;
        $.getJSON( url )
            .success( function( data ) {
                var entries = ( data.responseData
                                && data.responseData.feed
                                && data.responseData.feed.entries )
                    ? data.responseData.feed.entries
                    : null;
                self._entries( entries );
            });
    }),
    
    _entries: Control.chain( "$postList", "items" ),
    
    _urlParam: function( key, value ) {
        return value
            ? "&" + key + "=" + value
            : ""; 
    }
});

var BlogPost = Control.sub({
    className: "BlogPost",
    inherited: {
        content: [
            " ",
            {
                html: "<a target=\"_blank\" />",
                ref: "BlogPost_postTitle"
            },
            " ",
            {
                html: "<div />",
                ref: "BlogPost_content"
            },
            " "
        ],
        generic: "true"
    }
});
BlogPost.prototype.extend({
    
    content: Control.chain( "$BlogPost_content", "content" ),
    
    entry: Control.property( function( entry ) {
        this.postTitle( entry.title );
        this.link( entry.link );
        this.content( entry.content );
    }),
    
    postTitle: Control.chain( "$BlogPost_postTitle", "content" ),
    
    link: Control.chain( "$BlogPost_postTitle", "prop/href" )
    
});

/* Conditionally shows contents if the given browser is in use. */
var BrowserSpecific = Control.sub({
    className: "BrowserSpecific"
});
BrowserSpecific.prototype.extend({

    /*
     * Content to show if none of the specified browsers apply.
     */
    "default": Control.property(),
    
    initialize: function() {
        var content;
        if ( $.browser.mozilla ) {
            content = this.mozilla();
        }
        else if ( $.browser.msie ) {
            content = this.msie();
        }
        if ( $.browser.opera ) {
            content = this.opera();
        }
        if ( $.browser.webkit ) {
            content = this.webkit();
        }
        if ( content === undefined ) {
            content = this[ "default" ]();
        }
        this.content( content );
    },
    
    /*
     * Content to show to Mozilla (Firefox) users.
     */
    mozilla: Control.property(),
    
    /*
     * Content to show to Microsoft Internet Explorer users.
     */
    msie: Control.property(),
    
    /*
     * Content to show to Opera users.
     */
    opera: Control.property(),
    
    /*
     * Content to show to WebKit (Chrome, Safari) users.
     */
    webkit: Control.property()

});

/* A single day in a calendar */
var CalendarDay = Control.sub({
    className: "CalendarDay",
    inherited: {
        generic: "true"
    }
});
CalendarDay.prototype.extend({
    
    alternateMonth: Control.chain( "applyClass/alternateMonth" ),
    firstDayOfMonth: Control.chain( "applyClass/firstDayOfMonth" ),
    firstWeek: Control.chain( "applyClass/firstWeek" ),
    future: Control.chain( "applyClass/future" ),
    lastDayOfMonth: Control.chain( "applyClass/lastDayOfMonth" ),
    past: Control.chain( "applyClass/past" ),
    saturday: Control.chain( "applyClass/saturday" ),
    sunday: Control.chain( "applyClass/sunday" ),
    today: Control.chain( "applyClass/today" ),
    weekday: Control.chain( "applyClass/weekday" ),

    /*
     * The date to show.
     */
    date: Control.property.date( function( date ) {
        
        var today = CalendarDay.today();
        var dayOfWeek = date.getDay();
        var dayOfMonth = date.getDate();
        var nextDate = CalendarDay.addDays( date, 1 );
        var daysFromToday = Math.round( (date.getTime() - today.getTime()) / CalendarDay.MILLISECONDS_IN_DAY );
        
        this
            .past( date < today )
            .future( date > today )
            .firstDayOfMonth( dayOfMonth === 1 )
            .lastDayOfMonth( date.getMonth() !== nextDate.getMonth() )
            .firstWeek( dayOfMonth <= 7 )
            .sunday( dayOfWeek === 0 )
            .saturday( dayOfWeek === 6 )
            .weekday( dayOfWeek > 0 && dayOfWeek < 6 )
            .today( daysFromToday === 0 )
            .alternateMonth( Math.abs( date.getMonth() - today.getMonth()) % 2 === 1 )
            .content( date.getDate() );
    }),
    
    initialize: function() {
        var self = this;
        this.click( function( event ) {
            self.trigger( "dateSelected", [ self.date() ] );
        });
        if ( !this.date() ) {
            this.date( CalendarDay.today() );
        }
    }
    
});


// Class methods. These are general date utilities.
CalendarDay.extend({

    MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,

    // Return the result of adding the specified number of days to the given date.
    addDays: function( date, days ) {
        
        // Use noon hour for date math, since adding/subtracting multiples of 24 hours
        // starting from noon is guaranteed to end up on the correct date (although
        // the hours might have changed).
        var noon = new Date( date.getTime() );
        noon.setHours( 11 );
        var result = new Date( noon.getTime() + (days * this.MILLISECONDS_IN_DAY) );
        
        // Restore original hours
        result.setHours( date.getHours() );
        return result;
    },
    
    midnightOnDate: function( date ) {
        var d = new Date( date.getTime() );
        d.setHours( 0 );
        d.setMinutes( 0 );
        d.setSeconds( 0 );
        d.setMilliseconds( 0 );
        return d;
    },
    
    today: function() {
        return this.midnightOnDate( new Date() );
    }

});

/* Shows a day of the month as a button. */
var CalendarDayButton = CalendarDay.sub({
    className: "CalendarDayButton",
    inherited: {
        content: [
            " ",
            {
                control: "BasicButton",
                ref: "button",
                "class": "quiet"
            },
            " "
        ]
    }
});
CalendarDayButton.prototype.extend({
    content: Control.chain( "$button", "content" )
});

/* A month in a calendar */
var CalendarMonth = Control.sub({
    className: "CalendarMonth",
    inherited: {
        content: [
            " ",
            {
                control: "CalendarWeek"
            },
            " ",
            {
                control: "CalendarWeek"
            },
            " ",
            {
                control: "CalendarWeek"
            },
            " ",
            {
                control: "CalendarWeek"
            },
            " ",
            {
                control: "CalendarWeek"
            },
            " ",
            {
                control: "CalendarWeek"
            },
            " "
        ],
        generic: "true"
    }
});
CalendarMonth.prototype.extend({

    $days: Control.chain( "find/.CalendarDay", "control" ),
    $weeks: Control.chain( "children", "control" ),
    
    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this.$weeks().culture( culture );
            this._refresh();
        }
        return result;
    },

    /*
     * The class used to represent days in the month.
     */
    dayClass: Control.chain( "$weeks", "dayClass", function() { this._refresh(); } ),

    /*
     * The date that will be included in this month (can be any day of the month).
     */
    date: Control.property.date( function() {
        this
            ._refresh()
            .trigger( "dateChanged", [ this.date() ] );
    }),

    // Return the day control for the given date.
    dayControlForDate: function( date ) {
        return this.weekControlForDate( date ).dayControlForDate( date );
    },
    
    initialize: function() {
        if ( !this.date() ) {
            // By default, show current month.
            this.date( CalendarDay.today() );
        }
    },
    
    /*
     * Returns the week control for the given date.
     */
    weekControlForDate: function( date ) {
        // TODO: Return null if date is not within this month.
        var dayOMonth = date.getDate();
        var weeksWithDate = this.map( function( index, month ) {
            var $weeks = $( month ).control().$weeks();
            var firstDayOfMonth = new Date( date.getTime() );
            firstDayOfMonth.setDate(1);
            var offset = $weeks.daysSinceFirstDayOfWeek( firstDayOfMonth );
            var week = Math.floor( ( date.getDate() + offset - 1 ) / 7 );
            return $weeks[ week ];
        });
        var $weeksWithDate = $().add( weeksWithDate ).control();
        return $weeksWithDate;
    },
    
    _refresh: function() {

        // Use midnight on the given date as a reference point.
        var firstDayOfMonth = CalendarDay.midnightOnDate( this.date() );
        firstDayOfMonth.setDate(1);
        
        // Get last day of month by going to first day of next month and backing up a day.
        var lastDayOfMonth = new Date( firstDayOfMonth.getTime() );
        lastDayOfMonth.setMonth( lastDayOfMonth.getMonth() + 1 );
        lastDayOfMonth.setDate( lastDayOfMonth.getDate() - 1);
        
        // Fill in the weeks.
        var month = firstDayOfMonth.getMonth();
        this.$weeks().eachControl( function( weekRow, $week) {

            $week.date( CalendarDay.addDays( firstDayOfMonth, 7 * weekRow ) );
            
            // Hide weeks completely in another month (i.e., the next month).
            // Apply "hidden" class to preserve week's original "display" property.
            var $days = $week.$days();
            var firstDayOfWeek = $days.eq(0).date();
            var lastDayOfWeek = $days.eq(6).date();
            var isWeekInMonth = ( firstDayOfWeek.getMonth() === month || lastDayOfWeek.getMonth() === month );
            $week.toggleClass( "hidden", !isWeekInMonth );
        });
        
        // Paint days inside and outside range.
        this.$days().eachControl( function( index, $day ) {
            var date = $day.date();
            var insideMonth = date
                ? ( date >= firstDayOfMonth && date <= lastDayOfMonth )
                : false;
            $day
                .toggleClass( "insideMonth", insideMonth )
                .toggleClass( "outsideMonth", !insideMonth );

        });
        
        return this;
    }
    
});

/* Month calendar with headings for month name and year, plus days of week */
var CalendarMonthWithHeadings = Control.sub({
    className: "CalendarMonthWithHeadings",
    inherited: {
        content: [
            " ",
            {
                control: "MonthAndYear",
                ref: "monthAndYear"
            },
            " ",
            {
                html: "<div />",
                ref: "monthTable",
                content: [
                    " ",
                    {
                        control: "DaysOfWeek",
                        ref: "daysOfWeek",
                        format: "namesShort"
                    },
                    " ",
                    {
                        control: "CalendarMonth",
                        ref: "calendar"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "true"
    }
});
CalendarMonthWithHeadings.prototype.extend({
    
    $days: Control.chain( "$calendar", "$days" ),
    
    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this.$monthAndYear().culture( culture );
            this.$daysOfWeek().culture( culture );
            this.$calendar().culture( culture );
            var date = this.date();
            if ( date ) {
                this.date( date );
            }
        }
        return result;
    },
    
    /* The date shown in the calendar */
    date: Control.chain( "$calendar", "date", function( date ) {
        this.$monthAndYear().date( date );
    }),
    
    /*
     * The class used to represent days in the month.
     */
    dayClass: Control.chain( "$calendar", "dayClass" ),

    /*
     * Returns the control currently showing the given date.
     */
    dayControlForDate: function( date ) {
        return this.$calendar().dayControlForDate( date );
    },

    /*
     * The format used to show day headings. See DaysOfWeek.
     */
    dayNameFormat: Control.chain( "$daysOfWeek", "format" ),
    
    initialize: function() {
        if ( !this.date() ) {
            // By default, show current month.
            this.date( CalendarDay.today() );
        } else {
            // Sync month and year with calendar.
            this.$monthAndYear().date( this.date() );
        }
    },

    /*
     * True if the month name and year should be shown.
     */
    showMonthAndYear: Control.chain( "$monthAndYear", "visibility" )
    
});

/* Shows a single calendar week */
var CalendarWeek = Control.sub({
    className: "CalendarWeek",
    inherited: {
        content: [
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " ",
            {
                control: "CalendarDay"
            },
            " "
        ]
    }
});
CalendarWeek.prototype.extend({
    
    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this._refresh();
        }
        return result;
    },
    
    /*
     * The date that will be included in this week (can be any day of the week).
     */
    date: Control.property.date( function() { this._refresh(); }),

    /*
     * Returns the control currently used to represent the given date.
     */
    dayControlForDate: function( date ) {
        // TODO: Return null if date is not within this week.
        var days = this.map( function( index, week ) {
            var $week = $( week ).control();
            var dayIndex = $week.daysSinceFirstDayOfWeek( date );
            return $week.$days()[ dayIndex ];
        });
        var $days = $().add( days ).control();
        return $days;
    },

    /* The collection of day cells */
    $days: Control.chain( "children", "control" ),
    
    /*
     * The class used to represent days in the week.
     */
    dayClass: Control.chain( "$days", "transmute", function() { this._refresh(); } ),
    
    initialize: function() {
        if ( !this.date() ) {
            // Default date range is the current week.
            this.date( CalendarDay.today() );
        }
    },
    
    daysSinceFirstDayOfWeek: function( date ) {
        var firstDayOfWeek = this.firstDayOfWeek();
        return ( date.getDay() - firstDayOfWeek + 7 ) % 7;
    },
    
    // Return the index of the "first day of the week" in the current culture.
    // In English, this is 0 (Sunday), but in many places its 1 (Monday).
    firstDayOfWeek: function() {
        var culture = this.culture();
        return culture ? culture.calendar.firstDay : 0;
    },
    
    /*
     * Set the dates on all controls in the week.
     */
    _refresh: function() {

        // Use midnight on the given date as a reference point.
        date = CalendarDay.midnightOnDate( this.date() );

        // Get the first day of the week containing this date (e.g., Sunday).
        var dateStart = CalendarDay.addDays( date, -this.daysSinceFirstDayOfWeek( date ) );
        
        // Fill in the date range.
        this.$days().eachControl( function( index, $day) {
            $day.date( CalendarDay.addDays( dateStart, index ) );
        });
    }
    
});

/*
A panel that can expand and collapse.
*/
var Collapsible = Control.sub({
    className: "Collapsible",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "Collapsible_heading"
            },
            " ",
            {
                html: "<div />",
                ref: "Collapsible_content"
            },
            " "
        ],
        generic: "true"
    }
});
Collapsible.prototype.extend({
    
    /*
     * The control's contents which can be expanded and collapsed.
     */
    content: Control.chain( "$Collapsible_content", "content" ),
    
    /*
     * The speed of the expand/collapse animation, in milliseconds.
     */
    duration: Control.property( null, "fast" ),
    
    /*
     * Get or set the control's collapsed state.
     * When called as a setter, a true value collapsed the control;
     * a false value expands the control.
     */
	collapsed: Control.iterator( function( value ) {
	    if ( value === undefined )
	    {
	        // Getter
	        return this._collapsed();
	    } else {
	        // Setter
	        if ( this.inDocument() ) {
	            // Animate if in document.
                var result = value ? "hide" : "show";
                var self = this;
                this.$Collapsible_content().animate(
                    { 
                        height: result,
                        opacity: result
                    },
                    this.duration(),
                    null,
                    function() {
                        /* Wait until animation completes to apply collapsed style. */
                        self.toggleClass( "collapsed", value );
                    }
                );
	        } else {
	            // Not in document, animation won't work.
	            this
	               .toggleClass( "collapsed", value )
	               .$Collapsible_content().toggle( !value );
	        }
            
            if ( this._collapsed() !== value ) {
                this.trigger( "collapsedChanged" );
                this._collapsed( value );
            }
	    }
	}),
    
    /*
     * The control's heading. By default, a click anywhere within the heading
     * toggles the control's collapsed state.
     * 
     * This can be empty if the application wants to programmatically control
     * the collapsed state in some other means.
     */
    heading: Control.chain( "$Collapsible_heading", "content" ),
    
    initialize: function() {
        var self = this;
        this.$Collapsible_heading().click( function() {
            if ( self.toggleOnClick() ) {
                self.toggleCollapse();
            }
        });
    },
	
	/*
	 * Toggle the collapsed state of the control.
	 */
	toggleCollapse: function()
	{
		this.collapsed( !this.collapsed() );
	},
	
	/*
	 * True if the control should toggle its state when the user clicks in
	 * the heading. Default is true.
	 */
    toggleOnClick: Control.property.bool( null, true ),
    
    _collapsed: Control.property.bool( null, false )

});

/*
A collapsible panel whose heading region, by default, includes a button on
the far right that indicates the panel's collapsed/expanded state.
*/
var CollapsibleWithHeadingButton = Collapsible.sub({
    className: "CollapsibleWithHeadingButton",
    inherited: {
        heading: [
            " ",
            {
                control: "BasicButton",
                ref: "headingButton",
                content: [
                    " ",
                    {
                        html: "<div>+</div>",
                        ref: "collapsedButtonContent"
                    },
                    " ",
                    {
                        html: "<div>−</div>",
                        ref: "expandedButtonContent"
                    },
                    " ",
                    /* Minus sign, not hyphen */
                    " "
                ]
            },
            " ",
            {
                control: "Fader",
                ref: "CollapsibleWithHeadingButton_heading"
            },
            " "
        ]
    }
});
CollapsibleWithHeadingButton.prototype.extend({
    
    /*
     * The class of the heading button.
     */
    buttonClass: Control.chain( "$headingButton", "transmute" ),
    
    /*
     * The content of the heading button when the panel is collapsed.
     */
    collapsedButtonContent: Control.chain( "$collapsedButtonContent", "content" ), 
    
    /*
     * The content of the heading button when the panel is expanded.
     */
    expandedButtonContent: Control.chain( "$expandedButtonContent", "content" ),
    
    /*
     * The heading shown at the top of the panel.
     */
    heading: Control.chain( "$CollapsibleWithHeadingButton_heading", "content" ),
    
    initialize: function() {
        var $button = this.$headingButton();
        this.$Collapsible_heading().hover(
            function hoverIn() { $button.addClass( "hover" ); },
            function hoverOut() { $button.removeClass( "hover" ); }
        );
    }
    
});

/* Shows a block of a CSS color, either a color name or value. */
var ColorSwatch = Control.sub({
    className: "ColorSwatch"
});
ColorSwatch.prototype.extend({
    
    /*
     * The color to show. This will become the control's background color.
     */
    color: function( color ) {
        if ( color === undefined ) {
            return this.css( "background-color" );
        } else {
            
            this
                .css( "background-color", "white" ) // Apply white first
                .css( "background-color", color );  // Apply new color
        
            /* Validate the color value. */
            var colorValid;
            if ( color === "" || color === null ) {
                colorValid = false;
            } else if ( color === "white" || color === "rgb(255, 255, 255)" ) {
                // White color values are known to be good.
                colorValid = true;
            } else {
                // See if the new value "stuck", or is still white.
                var colorValue = this.css( "background-color" );
                colorValid = !( colorValue === "white" || colorValue === "rgb(255, 255, 255)" );
            }
            return this.toggleClass( "none", !colorValid );
        }
    }
    
});

var ColorSwatchTextBox = Control.sub({
    className: "ColorSwatchTextBox",
    inherited: {
        content: [
            " ",
            {
                control: "ColorSwatch",
                ref: "swatch"
            },
            {
                html: "<input type=\"text\" />",
                ref: "ColorSwatchTextBox_content"
            },
            " "
        ]
    }
});
ColorSwatchTextBox.prototype.extend({

    /*
     * The text box's content. Setting this to a color name or RGB value
     * will show a color swatch of the color with that name.
     */
    content: Control.chain( "$ColorSwatchTextBox_content", "content", function( content ) {
        this._refresh();
    }),
    
    initialize: function() {
        var self = this;
        this.keyup( function() {
            self._refresh();
        });
    },
    
    _refresh: function() {
        this.$swatch().color( this.content() );
    }
    
});

/* Heading for a 7 day week calendar, globalized. */
var DaysOfWeek = Control.sub({
    className: "DaysOfWeek",
    inherited: {
        content: " <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> <div class=\"dayOfWeek\" /> ",
        generic: "true"
    }
});
DaysOfWeek.prototype.extend({
    
    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this.format( this.format() );
        }
        return result;
    },
    
    /*
     * The format used to show the names of the day. These are defined by
     * the Globalize library:
     * 
     *  "names": the full name, e.g. "Sunday".
     *  "namesAbbreviated": an abbreviated name, e.g., "Sun".
     *  "namesShort": an even shorter name, e.g., "Su".
     */
    format: Control.property( function( format ) {
        
        var culture = this.culture();
        var dayNameEnum = culture ? culture.calendar.days : DaysOfWeek.days;
        var dayNames = dayNameEnum[ format ];
        
        var firstDay = culture ? culture.calendar.firstDay : 0;
        
        var $children = this.children();
        for ( var i = 0; i < dayNames.length; i++ ) {
            var day = (i + firstDay) % 7;
            var dayName = dayNames[ day ];
            $children.eq(i).content( dayName );
        }
    }),

    initialize: function() {
        if ( !this.format() ) {
            this.format( "namesAbbr" );
        }
    }
    
});

DaysOfWeek.extend({
    
    // Default names; used if Globalize is not loaded.
    days: {
        // full day names
        names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
        
        // abbreviated day names
        namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        
        // shortest day names
        namesShort: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ]
    }
    
})

/* Load different content, control class, or styles depending on the type of device. */
var DeviceSpecific = Control.sub({
    className: "DeviceSpecific",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "placeholder"
            },
            " "
        ]
    }
});
DeviceSpecific.prototype.extend({
    
    content: Control.chain( "$placeholder", "content" ),

    /*
     * The content to use when the current device is not a mobile device.
     */
    "default": Control.property(),
    
    /*
     * The class of the control when the current device is not a mobile device.
     */
    "defaultClass": Control.property[ "class" ](),
    
    initialize: function() {

        var deviceClass;
        var deviceClasses;
        var deviceContent;

        // Determine which content, class, and styles to apply.        
        if ( DeviceSpecific.isMobile() ) {
            deviceClass = this.mobileClass();
            deviceClasses = "mobile";
            deviceContent = this.mobile();
        }
        if ( deviceClass === undefined ) {
            deviceClass = this.defaultClass();
        }
        if ( deviceContent === undefined ) {
            deviceContent = this["default"]();
        }
        
        var $placeholder = this.$placeholder();
        
        if ( deviceClass ) {
            // Transmute as requested.
            var $placeholder = $placeholder.transmute( deviceClass, false, true )
            // Update the placeholder reference so it's the right class.
            this.referencedElement( "placeholder", $placeholder );
        }
        
        if ( deviceContent ) {
            // Apply device-specific content.
            $placeholder.content( deviceContent );
        }
        
        if ( deviceClasses ) {
            // Apply device-specific CSS classes.
            $placeholder.addClass( deviceClasses );
        }
    },
    
    /*
     * The content to use when the current device is a mobile device.
     */
    "mobile": Control.property(),
    
    /*
     * The class of the control when the current device is a mobile device.
     */
    "mobileClass": Control.property[ "class" ]()

});

// Class methods
DeviceSpecific.extend({
    isMobile: function() {
        var userAgent = navigator.userAgent;
        return ( userAgent.indexOf("Mobile") >= 0 && userAgent.indexOf("iPad") < 0 ); 
    }    
});

/* Renders a JavaScript dictionary as a table. */
var DictionaryTable = ArrayTable.sub({
    className: "DictionaryTable",
    inherited: {
    }
});
DictionaryTable.prototype.extend({

    /*
     * A standard JavaScript { key: value } dictionary to render as a table.
     * Each item will be a row with two columns for its key and value.
     */
    content: Control.property( function( dictionary ) {
        var array = $.map( dictionary, function( value, key ) {
            return [ [ key, value ] ];
        });
        ArrayTable( this ).content( array );
    })
    
});

/*
Fades its content to the background color on the right/bottom edge if the
content is too long. Must set explicitly set the control's background-color
if the color is not white. 
*/
var Fader = Control.sub({
    className: "Fader",
    inherited: {
        "class": "horizontal",
        content: [
            " ",
            {
                html: "<div />",
                ref: "Fader_content"
            },
            " ",
            {
                control: "Gradient",
                ref: "gradient",
                direction: "horizontal"
            },
            " "
        ]
    }
});
Fader.prototype.extend({
    
    content: Control.chain( "$Fader_content", "content" ),
    
    /*
     * The direction in which the content should fade. If "horizontal" (the
     * default), the content will fade to the right. If "vertical", the content
     * will fade to the bottom.
     */
    direction: Control.property( function( direction ) {
        var vertical = ( direction !== "horizontal" );
        this
            .toggleClass( "horizontal", !vertical )
            .toggleClass( "vertical", vertical );
        if ( this.inDocument() ) {
            this._redraw();
        }
        this.$gradient().direction(direction);
    }),
    
    initialize: function() {
        this.inDocument( function() {
            this._redraw();
        });
    },
    
    // Expand a color like #abc into #aabbcc.
    _expandShortHexValue: function( s ) {
        var shortHex = s.slice( 1 ); // Remove "#"
        var longHex = "";
        for ( var i = 0; i < shortHex.length; i++ ) {
            var c = shortHex[i];
            longHex += c + c;
        }
        return "#" + longHex;
    },

    _hexByte: function( n ) {
        var s = ( new Number( n & 0xFF ) ).toString( 16 );
        if ( s.length === 1 )
        {
            s = "0" + s;
        }
        return s;
    },
    
    _redraw: Control.iterator( function() {
        var backgroundColor = this.css("background-color");
        var backgroundHex = ( backgroundColor.length === 4 )
            ? this._expandShortHexValue( backgroundColor ) 
            : ( backgroundColor.substr( 0, 3 ).toLowerCase() === "rgb" )
                ? this._rgbStringToHexColor( backgroundColor )
                : backgroundColor;
        this.$gradient()
            .start( backgroundHex + "00" )
            .end( backgroundHex );
    }),
    
    _rgbStringToHexColor: function( rgbString ) {
        rgb = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return "#"
            + this._hexByte( rgb[1] )
            + this._hexByte( rgb[2] )
            + this._hexByte( rgb[3] );
    }
    
});

/* Shows the most interesting photo on Flickr for a given day. */
var FlickrInterestingDay = CalendarDay.sub({
    className: "FlickrInterestingDay",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "FlickrInterestingDay_content"
            },
            " ",
            {
                html: "<a />",
                ref: "link",
                content: [
                    " ",
                    {
                        html: "<img />",
                        ref: "image"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "false"
    }
});
FlickrInterestingDay.prototype.extend({
    
    /*
     * True if the control should automatically load the photo when the date
     * is set. Default is false.
     */
    autoLoad: Control.property.bool( function( autoLoad ) {
        if ( autoLoad && this.image() == null ) {
            this.loadPhoto();
        }
    }),
    
    /*
     * The date to show.
     */
    date: function( date ) {
        var result = this._super( date );
        if ( date !== undefined ) {
            this
                .image( null )
                .href( null );
            if ( this.autoLoad() ) {
                this.loadPhoto();
            }
        }
        return result;
    },

    content: Control.chain( "$FlickrInterestingDay_content", "content" ),
    
    /*
     * The location of the Flickr page for the photo.
     */
    href: Control.chain( "$link", "attr/href" ),
    
    /*
     * The location of the photo image on Flickr.
     */
    image: Control.chain( "$image", "attr/src" ),
    
    initialize: function() {
        if ( !this.date() ) {
            // Default day is *yesterday* (since we need a date in the past).
            var date = CalendarDay.today();
            date.setDate( date.getDate() - 1 );
            this.date( date );
        }
    },
    
    /*
     * Load the photo for the given date.
     */
    loadPhoto: Control.iterator( function() {
        var date = this.date();
        // Flickr only has a photo for dates entirely in the past (not for today).
        if ( date && date < CalendarDay.today() ) {
            
            var self = this;
            FlickrInterestingDay.getInterestingPhotoForDate( date, function( photo ) {
                // Double-check we got a photo, and also check that the date
                // hasn't been changed since the photo was requested.
                if ( photo && date === self.date() ) {
                    self.image( photo.src );
                }
            });
            
            // Clicking the day navigates to list of the day's interesting photos.
            var baseUrl = "http://www.flickr.com/explore/interesting/";
            var url = baseUrl
                + date.getFullYear() + "/"
                + ( date.getMonth() + 1 ) + "/"
                + date.getDate();
            this.href( url );
        }
    })

});

// Class methods
FlickrInterestingDay.extend({
    
    // Please replace with your own API key.
    _flickrApiKey: "c3685bc8d8cefcc1d25949e4c528cbb0",
    
    // Cache of photos already loaded, indexed by Flickr-style date string. 
    _cache: {},
    
    getInterestingPhotoForDate: function( date, callback ) {
        
        var flickrDate = this._formatFlickrDate( date );
        var cachedPhoto = this._cache[ flickrDate ];
        if ( cachedPhoto ) {
            callback( cachedPhoto );
            return;
        }
        
        var params = {
            method: "flickr.interestingness.getList",
            date: flickrDate,
            per_page: 1
        };
        var self = this;
        this.getFlickrPhotos( params, function( flickrPhotos ) {
            if ( flickrPhotos && flickrPhotos.length > 0 ) {
                var first = flickrPhotos[0];
                var photo = {
                    src: self.getFlickrImageSrc( first, "s" /* Small thumbnail */ ),
                    href: self.getFlickrImageHref( first )
                };
                self._cache[ flickrDate ] = photo;
                callback( photo );
            }
        });
    },
    
    getFlickrPhotos: function( params, callback ) {

        var baseUrl = "http://api.flickr.com/services/rest/";
        
        // Note: JSONP in jQuery usually calls for callback=?, but the Flickr
        // API wants jsoncallback=?. Thankfully, jQuery supports that.
        var url = baseUrl
                    + "?api_key=" + this._flickrApiKey
                    + this._formatUrlParams( params )
                    + "&format=json"
                    + "&jsoncallback=?";

        $.getJSON( url )
            .success( function( data ) {
                if ( data && data.photos ) {
                    callback( data.photos.photo );
                }
            });
    },
    
    getFlickrImageSrc: function( flickrPhoto, size ) {
        var sizeParam = ( size ? "_" + size : "" );
        return "http://farm" + flickrPhoto.farm +
               ".static.flickr.com/" + flickrPhoto.server +
               "/" + flickrPhoto.id +
               "_" + flickrPhoto.secret +
               sizeParam +
               ".jpg";
    },
    
    getFlickrImageHref: function(flickrPhoto) {
        return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
    },
    
    // Return a date in YYYY-MM-DD format.
    _formatFlickrDate: function( date ) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var s = year + "-" +
                ( ( month < 10 ) ? "0" : "" ) + month + "-" +
                ( ( day < 10 ) ? "0" : "" ) + day;
        return s;
    },
    
    // Convert the given params dictionary into a string that can be
    // passed on a URL.
    _formatUrlParams: function( params ) {
        var s = "";
        $.each( params, function( key, value ) {
            s += "&" + key + "=" + value;
        });
        return s;
    }

});

/*
Shows a random photo from Flickr's Interestingness collection for a recent day.
By default, this can be used 100 times before it starts repeating photos.

This gets photos from the day before yesterday in the current time zone.
This is done because yesterday in the current time zone may still be "today" in
Flickr's time zone, and Flickr doesn't make photos available for the current day. 
*/
var FlickrInterestingPhoto = Control.sub({
    className: "FlickrInterestingPhoto",
    tag: "img"
});
FlickrInterestingPhoto.prototype.extend({
    
    initialize: function() {
        
        this.on( "load" , function() {
            
            /*
             * HACK for IE. When the load event is triggered, IE reports the
             * width of the img element as the width of its own little image
             * placeholder icon. This stinks -- there's no way to get the
             * correct width or height until sometime after the load event
             * completes.
             * 
             * As a workaround, if we're in IE and see that the width is 28px,
             * we assume we're dealing with the image placeholder icon instead
             * of the real image. By forcing the width to "auto", IE reports the
             * correct photo width (and height) instead.
             * 
             * This allows anyone listening for the layout event to get
             * the correct dimensions of the photo, instead of the dimensions
             * of the image placeholder icon. 
             */
            var control = Control( this );
            if ( $.browser.msie && parseInt( control.width() ) === 28 ) {
                control.css( "width", "auto" );
            }

            control.checkForSizeChange();
        });

        var photo = this.photo();
        if ( !photo || photo.length === 0 ) {
            this.reload();
        }
    },
    
    /*
     * Reload the photo.
     */
    reload: Control.iterator( function() {
        var self = this;
        FlickrInterestingPhoto.getRandomPhoto( function( photo ) {
            self.prop( "src", photo );
        }, this.photoSize());
    }),
    
    /*
     * The location of the current photo image.
     */
    photo: Control.chain( "attr/src" ),
    
    /*
     * The size of photo to show.
     * 
     * This uses the size suffixes from http://www.flickr.com/services/api/misc.urls.html
     * s   small square 75x75
     * t   thumbnail, 100 on longest side
     * m   small, 240 on longest side
     * -   medium, 500 on longest side
     * z   medium 640, 640 on longest side
     * o   original image, either a jpg, gif or png, depending on source format
     * 
     * If this property is not set, the photo will be medium size.
     */
    photoSize: Control.property( function() {
        var photo = this.photo();
        if ( photo && photo.length > 0 ) {
            this.reload();
        }
    })
    
});

// Class methods
FlickrInterestingPhoto.extend({
    
    /*
     * Your Flickr API key. By default, this uses the QuickUI account API key.
     * Set this to your own key before the first call to this control.
     */
    apiKey: "c3685bc8d8cefcc1d25949e4c528cbb0",

    /*
     * Return a (somewhat) random photo from the Interestingness collection.
     * The set of photos are obtained only once per page; once the set is
     * exhausted, subsequent calls will cycle through the set. 
     */    
    getRandomPhoto: function( callback, size ) {
        var self = this;
        this.getFlickrInterestingPhotos().done( function( flickrPhotos ) {
            self._counter = ( self._counter >= 0 )
                ? ( self._counter + 1 ) % flickrPhotos.length 
                : 0;
            var flickrPhoto = flickrPhotos[ self._counter ];
            var photo = self.getFlickrImageSrc( flickrPhoto, size );
            callback( photo );
        });
    },

    getFlickrInterestingPhotos: function() {
        if ( !this._promise ) {

            // This is the first request for photos.             
            var deferred = new jQuery.Deferred();
            this._promise = deferred.promise();
            
            var day = new Date();
            day.setDate( day.getDate() - 2 );   // Day before yesterday
            var flickrDate = this._formatFlickrDate( day );
            
            var params = {
                method: "flickr.interestingness.getList",
                date: flickrDate,
                per_page: 100
            };
    
            var self = this;
            this.getFlickrPhotos( params, function( flickrPhotos ) {
                // Shuffle the photos before returning them.
                self._shuffle( flickrPhotos );
                self._flickrPhotos = flickrPhotos;
                deferred.resolve( flickrPhotos );
            });
        }
        return this._promise;
    },
    
    getFlickrPhotos: function( params, callback ) {
        var baseUrl = "http://api.flickr.com/services/rest/";
        var url = baseUrl 
                    + "?api_key=" + this.apiKey
                    + this._formatUrlParams( params )
                    + "&format=json"
                    + "&jsoncallback=?";
        $.getJSON( url, function( data ) {
            if ( data && data.photos ) {
                callback( data.photos.photo );
            }
        });
    },
    
    getFlickrImageSrc: function( flickrPhoto, size ) {
        var sizeParam = ( size ? "_" + size : "" );
        return "http://farm" + flickrPhoto.farm +
               ".static.flickr.com/" + flickrPhoto.server +
               "/" + flickrPhoto.id +
               "_" + flickrPhoto.secret +
               sizeParam +
               ".jpg";
    },
    
    getFlickrImageHref: function(flickrPhoto) {
        return "http://flickr.com/photo.gne?id=" + flickrPhoto.id;
    },
    
    // Return a date in YYYY-MM-DD format.
    _formatFlickrDate: function( date ) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var s = year + "-" +
                ( ( month < 10 ) ? "0" : "" ) + month + "-" +
                ( ( day < 10 ) ? "0" : "" ) + day;
        return s;
    },
    
    // Convert the given params dictionary into a string that can be
    // passed on a URL.
    _formatUrlParams: function( params ) {
        var s = "";
        $.each( params, function( key, value ) {
            s += "&" + key + "=" + value;
        });
        return s;
    },

    /*
     * Perform a Fisher-Yates shuffle.
     * From http://sedition.com/perl/javascript-fy.html
     */
    _shuffle: function( array ) {
        for ( var i = array.length - 1; i >= 0; i-- ) {
            var j = Math.floor( Math.random() * ( i + 1 ) );
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

});

var GoogleAd = Control.sub({
    className: "GoogleAd"
});
/* AdSense globals */
var google_ad_client, google_ad_slot, google_ad_width, google_ad_height;

GoogleAd.prototype.extend({

    initialize: function() {
        google_ad_client = "ca-pub-6699868724002545";
        this.inDocument( function() {

            /* Leaderboard */
            google_ad_slot = "7561741805";
            google_ad_width = 728;
            google_ad_height = 90;

            // Force (re?)load of AdSense script.
            $.get( "http://pagead2.googlesyndication.com/pagead/show_ads.js" );
        });
    }
    
});

/*
Gradient. Supports the different browser-specific syntax.
Alpha values are possible, but all colors must be specified as RGBA hex values.
*/
var Gradient = Control.sub({
    className: "Gradient"
});
Gradient.prototype.extend({

    /*
     * The direction of the gradient: "horizontal" or "vertical" (the default).
     */    
    direction: Control.property(function() { this._redraw(); }, "vertical"),
    
    /*
     * The ending value for the gradient.
     */
    end: Control.property(function() { this._redraw(); }),
    
    initialize: function() {
        this._redraw();
    },

    /*
     * The starting value for the gradient.
     */
    start: Control.property(function() { this._redraw(); }),
    
    _redraw: function() {

        if ( !this.inDocument() ) {
            return;
        }
        
        var direction = this.direction();
        var start = this.start();
        var end = this.end();
        if (direction && start && end)
        {
            var horizontal = (direction === "horizontal");
            var startColorString = this._hexColorToRgbString(start);
            var endColorString = this._hexColorToRgbString(end);
            var property;
            var value;
            if ($.browser.mozilla)
            {
                property = "background-image";
                var position = horizontal ? "left" : "top";
                value = "-moz-linear-gradient(" + position + ", " + startColorString + ", " + endColorString + ")";
            }
            else if ($.browser.webkit)
            {
                property = "background-image"; 
                var position2 = horizontal ? "right top" : "left bottom";
                value = "-webkit-gradient(linear, left top, " + position2 + ", from(" + startColorString + "), to(" + endColorString + "))";
            }
            else if ($.browser.msie)
            {
                property = "filter";
                var gradientType = horizontal ? 1 : 0;
                value = "progid:DXImageTransform.Microsoft.gradient(gradientType=" + gradientType + ", startColorStr=" + startColorString + ", endColorStr=" + endColorString + ")"; 
            }

            this.css(property, value);
        }
    },
    
    /* Convert a hex color like #00ff00 to "rgb(0, 255, 0)" */
    _hexColorToRgbString: function(hex) {
        
        if (hex.substr(0, 1) == "#")
        {
            // Remove "#"
            hex = hex.substring(1);
        }
        var hasAlpha = (hex.length == 8);
        var color = parseInt(hex, 16);
        var a;
        
        var rgbString;
        if ($.browser.msie)
        {
            // Internet Explorer
            rgbString = hex;
            if (hasAlpha)
            {
                // Move alpha to front, from RGBA to ARGB.
                a = rgbString.slice(6);
                rgbString = a + rgbString.substr(0, 6);
            }
            rgbString = "#" + rgbString; 
        }
        else
        {
            // WebKit, Mozilla
            var colorStringType = hasAlpha ? "rgba" : "rgb";
            var alphaString = "";
            if (hasAlpha)
            {
                // Convert alpha from hex to decimal.
                a = (color & 0xFF) / 255;
                alphaString = "," + a;
                color = color >> 8;
            }
            
            var r = (color >> 16) & 0xFF;
            var g = (color >> 8)  & 0xFF;
            var b = color         & 0xFF;
            
            rgbString = colorStringType + "(" + r + "," + g + "," + b + alphaString + ")";
        }
        
        return rgbString;
    }
    
});

/*
Apply effects on hover, which can include changing the item's size
and position.

To animate color properties, use a plugin such as Color Animation at
http://plugins.jquery.com/project/color-animation.
*/
var HighlightEffects = Control.sub({
    className: "HighlightEffects",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "HighlightEffects_content"
            },
            " "
        ],
        generic: "true"
    }
});
HighlightEffects.prototype.extend({
    
    _originalState: Control.property(),
    
    /*
     * The control's content.
     */
    content: Control.chain( "$HighlightEffects_content", "content", function() {
        if ( this.inDocument() ) {
            this._recalc();
        }
    }),
    
    /*
     * The speed with which animations are applied.
     * 
     * This uses a faster default than $.animate(), since hover animations
     * should generally respond quickly.
     * 
     * Set this to 0 to have effects applied instantaneously.
     */
    duration: Control.property( null, 100 ),
    
    /*
     * The effects that will be applied on hover.
     */
    effects: Control.property( function() {
        this._originalState( this._getCurrentState() );
    }),
    
    initialize: function() {

        var self = this;
        this
            .on( "layout", function() {
                self._recalc();
            })
            .hover(
                function() { self._hoverIn(); },
                function() { self._hoverOut(); }
            )
            .inDocument( function() {
                this
                    ._originalState( this._getCurrentState() )
                    ._recalc();
            });
    },

    /*
     * Get the current values of all CSS attributes which will be overwritten
     * by the effects. This snapshot is used on hover out to restore the
     * original state.
     */
    _getCurrentState: function() {
        var currentState = {};
        var $content = this.$HighlightEffects_content();
        var effects = this.effects();
        for ( var key in effects ) {
            var value;
            switch ( key ) {

                /*
                 * When border properties are applied, they may get split up
                 * into border-<side> properties, leaving the overall border
                 * properties empty. So, use the properties of one of the
                 * border sides as a proxy for the overall border properties.
                 */
                case "border-color":
                    value = $content.css( "border-top-color" );
                    break;
                case "border-width":
                    value = $content.css( "border-top-width" );
                    break;
                
                /*
                 * Map dimensions of "auto" to "0" so that the dimension can
                 * be animated. 
                 */
                case "bottom":
                case "left":
                case "right":
                case "top":
                    value = $content.css( key );
                    if ( value === "auto" ) {
                        value = "0";
                    }
                    break;
                    
                default:
                    value = $content.css( key );
                    break;
            }
            currentState[ key ] = value;
        }
        return currentState;
    },

    _hoverIn: function() {
        this.$HighlightEffects_content()
            .stop() // In case this was doing its _hoverOut animation
            .css({
                "position": "absolute",
                "z-index": "2"  // In front of any element doing _hoverOut
            })
            .animate( this.effects(), this.duration() );
    },
    
    _hoverOut: function() {
        var savedState = this._originalState() || {};
        this.$HighlightEffects_content()
            .stop() // In case this was doing its _hoverIn animation
            .css({
                // Show in front of peer elements, but behind _hoverIn element.
                "z-index": "1" 
            })
            .animate( savedState, this.duration(), null, function() {
                // Restore normal positioning when animation completes.
                $( this ).css({
                    "position": "inherit",
                    "z-index": "inherit"
                });
            });
    },
    
    /*
     * Update the control's size to match the contents. This lets us
     * apply absolute positioning to the contents on hover while still
     * preserving room for the content in the normal document flow.
     */
    _recalc: function() {
        this.height( this.$HighlightEffects_content().outerHeight() );
        this.width( this.$HighlightEffects_content().outerWidth() );
    }
    
});

/* A text box that shows a "hint" as to what the user should enter. */
var HintTextBox = Control.sub({
    className: "HintTextBox",
    inherited: {
        content: [
            " ",
            {
                html: "<input type=\"text\" />",
                ref: "HintTextBox_textBox"
            },
            " ",
            {
                html: "<div />",
                ref: "HintTextBox_hint"
            },
            " "
        ],
        generic: "true"
    }
});
HintTextBox.prototype.extend({
    
    /*
     * The content of the text box.
     */
    content: Control.chain( "$HintTextBox_textBox", "content", function() {
        this._showHintIfEmpty();
    }),
    
    /*
     * The "hint" shown within the text box that suggests what the user should
     * type there. This hint is hidden if: the text box has content, the
     * text box has just acquired the keyboard focus, or if the user clicks in
     * the text box. 
     */
    hint: Control.chain( "$HintTextBox_hint", "content" ),
    
    initialize: function() {
        var self = this;
        this.on({
            "click": function() { self._hideHint(); },
            "focus": function() {
                if ( !self._isTextBoxFocused() )
                {
                    self.$HintTextBox_textBox().focus();
                }
            }
        });
        this.$HintTextBox_textBox().on({
            blur: function() {
                self
                    ._isTextBoxFocused( false )
                    ._showHintIfEmpty();
            },
            focus: function() { self._isTextBoxFocused( true ); },
            keydown: function( event ) { self._handleKeydown( event ); },
            keyup: function() { self._showHintIfEmpty(); }
        });
        this.$HintTextBox_hint().click( function() {
            self._hideHint();
        });
    },
    
    _isTextBoxFocused: Control.property( null, false ),
    
    /*
     * The keydown event comes before the browser has processed it, so we can't
     * tell at this point for sure what the final text is. However, we can
     * speculate as to whether the result of the key will add or remove text.
     * Most keys will add a character to the text box, in which case we'll end
     * up removing the hint; rather than waiting for keyup to check whether the
     * text is non-empty, we'll hide the hint now. In special cases, we defer
     * hiding the hint until the keyup event, when we can check the final text
     * that includes the result of the key.
     */
    _handleKeydown: function( event ) {
        var keysOfUnknownEffect = [
            8,  // Backspace
            9,  // Tab
            16, // Shift
            17, // Ctrl
            18, // Alt
            19, // Pause/Break
            20, // Caps Lock
            27, // Esc
            33, // Page Up
            34, // Page Down
            35, // End
            36, // Home
            37, // Left
            38, // Up
            39, // Right
            40, // Down
            45, // Insert
            46, // Delete
            91, // Windows
            93, // Context menu
            144, // Num lock
            145, // Scroll lock
            182, // Computer
            183, // Calculator
        ];
        if ( $.inArray( event.which, keysOfUnknownEffect ) < 0 ) {
            // Probably a text key. Preemptively hide the hint.
            this.$HintTextBox_hint().hide();
        }
    },
    
    _hideHint: function() {
        this.$HintTextBox_hint().hide();
        this.$HintTextBox_textBox().focus();
    },
    
    /*
     * This routine is a more careful check to see whether we should show the
     * hint or not. We can call this on blur or keyup (when, unlike keydown,
     * the final state of the text is known).
     */
    _showHintIfEmpty: function() {
        this.$HintTextBox_hint().toggle( this.content().length === 0 );
    }
    
});

var LabeledColorSwatch = Control.sub({
    className: "LabeledColorSwatch",
    inherited: {
        content: [
            " ",
            {
                control: "ColorSwatch",
                ref: "swatch"
            },
            {
                html: "<div />",
                ref: "ColorSwatchButton_content"
            },
            " "
        ]
    }
});
LabeledColorSwatch.prototype.extend({
    
    /*
     * The color to show.
     */
    color: Control.chain( "$swatch", "color" ),
    
    /*
     * The swatch's label. Setting this implicitly sets the color to show
     * the color with the indicated name.
     */
    content: Control.chain( "$ColorSwatchButton_content", "content", function( content ) {
        this.$swatch().color( content );
    })
    
});

/*
An input control (e.g., a check box or radio button) with an associated label.

The control's top element is a label, which ensures that user clicks anywhere
within have the same effect as clicking the input control.
*/
var LabeledInput = Control.sub({
    className: "LabeledInput",
    tag: "label",
    inherited: {
        content: [
            " ",
            "<input />",
            {
                html: "<span />",
                ref: "LabeledInput_content"
            },
            " "
        ]
    }
});
LabeledInput.prototype.extend({
    
    /*
     * True if the input control is checked, false if unchecked.
     */
    checked: Control.chain( "_inputControl", "prop/checked" ),
    
    /*
     * The label for the input control.
     * This can be arbitrary content, not just text.
     */
    content: Control.chain( "$LabeledInput_content", "content" ),
    
    /*
     * True if the input control should be disabled.
     */
    disabled: Control.chain( "_inputControl", "prop/disabled" ),
    
    /*
     * Return the input control.
     * We restrict our search to direct children, in case the label also
     * includes input controls.
     */
    _inputControl: Control.chain( "children", "filter/input" ),
    
    /*
     * Sets the input control's type.
     * This is set in subclasses CheckBox and RadioButton.
     */
    _type: function( type ) {
        var input = this._inputControl();        
        if ( type !== undefined && $.browser.msie && parseInt( $.browser.version ) < 9 ) {
            // IE8 can't change an input's "type" attribute.
            for ( i = 0; i < this.length; i++ ) {
                var oldInput = input.eq(i);
                // Create a new input to replace the existing one.
                var newInput = $( "<input type='" + type + "'/>" ).prop({
                    // Copy old input's properties to new one.
                    checked: oldInput.prop( "checked" ),
                    disabled: oldInput.prop( "disabled" )
                });
                oldInput.replaceWith( newInput );
            }
            return this;
        } else {
            return input.prop( "type", type );
        }
    }

});

/*
Wraps an anchor tag.

Unlike a stock anchor tag, this will show a hand cursor even when the href
is empty, as is often the case with a link whose behavior is determined by
a click event handler.

The link will have the "current" style if it points to the current page.

This can also serve as a useful base class for custom link classes.
*/
var Link = Control.sub({
    className: "Link",
    tag: "a"
});
Link.prototype.extend({
    
    /*
     * True if the link points to the current page.
     */
    current: Control.chain( "applyClass/current" ),

    /*
     * The location that will be opened if the user clicks the link.
     */
    href: Control.chain( "prop/href", function() {
        this._checkIfCurrent();
    }),
    
    initialize: function() {
        if ( this.href() ) {
            this._checkIfCurrent();
        } else { 
            // Set a placeholder href which will force the display of an
            // underline, and use of a hand cursor.
            this.href( "javascript:" );
        }
    },
    
    /*
     * True if the link points to an area of the site (with sub-pages). If
     * true, the link will be considered current if it points to any page within
     * that area of the site. The default is false.
     */
    linksToArea: Control.property( function() {
        this._checkIfCurrent();
    }),

    /*
     * The target of the link.
     */
    target: Control.chain( "prop/target" ),

    /*
     * Apply the "current" style if the link points to the page we're on.
     */    
    _checkIfCurrent: function() {
        var current = false;
        var localPath = this._localPath();
        if ( localPath ) {
            var pathname = window.location.pathname;
            var pathToMatch = this.linksToArea()
                // Area link: Current if it matches on the left.
                ? pathname.substring( 0, localPath.length )
                // Normal link: Current if the whole path matches. 
                : pathname;
            current = ( localPath === pathToMatch );
        }
        this.current( current );
    },
    
    /*
     * Returns the pathname portion of the link (the portion after the domain)
     * if the link points to a location in the current domain. Otherwise
     * return null.
     */
    _localPath: function() {
        var href = this.href();
        if ( !href ) {
            return null;
        }
        var origin = window.location.protocol + "//" + window.location.hostname + "/";
        // Does left portion of link match origin?
        return pathname = ( href.substring( 0, origin.length ) === origin )
            ? href.substring( origin.length - 1 ) // Include last slash in origin
            : href;
    }

});

/*
Creates a set of controls, one for each item in a list.
*/
var List = Control.sub({
    className: "List"
});
List.prototype.extend({
    
    /*
     * collection of controls in the list generated by setting the items() property.
     * Read-only. This is always returned as an instance of itemClass.
     */
    controls: function() {
        var itemClass = this.itemClass();
        return itemClass( this ).children();
    },
    
    /*
     * True if the control should mark itself dirty when it gets a change event.
     * The default is false.
     */
    dirtyOnChange: Control.property.bool( null, false ),
    
    initialize: function() {
        var self = this;
        this.change( function( event ) {
            if ( self.dirtyOnChange() ) {
                // Assume the list is dirty.
                self.isDirty( true );
            }
        });
    },

    /*
     * Insert a new item before the existing item at the given index.
     */
    insertItemBefore: Control.iterator( function( item, index ) {

        // Create the control.
        var itemClass = this.itemClass();
        var $control = itemClass.create();
        this._mapAndSetup( $control, item );

        // Add the control to the list.
        var children = this.children();
        if ( index >= children.length )
        {
            this.append( $control );
        } else {
            children.eq( index ).before( $control );
        }

        // Update the cached item array as well.
        var items = this._itemsCache() || [];
        items.splice( index, 0, item );
        this._itemsCache( items );
    }),
    
    /*
     * True if the list's items have been changed since the controls were first created.
     */
    isDirty: Control.property.bool( null, true ),

    /*
     * The class used to render items in the list as controls.
     */
    itemClass: Control.property[ "class" ]( function() {
        // Get the existing items.
        var items = this.isDirty() ? this.items() : this._itemsCache();
        this
            .empty()            // Throw out the existing controls.
            .items( items );    // Create new controls.
    }, Control ),
    
    /*
     * The array of items in the list.
     */
    items: function( items ) {
        if ( items === undefined ) {
            if ( this.isDirty() ) {
                this
                    ._itemsCache( this._getItemsFromControls() )
                    .isDirty( false );
            }
            return this._itemsCache();
        } else {
            // Cache a copy of the items array. We use a copy because the array
            // may later be manipulated withour knowledge.
            var itemsCopy = items.slice(0);
            return this
                ._itemsCache( itemsCopy )
                ._createControlsForItems( itemsCopy )
                .isDirty( false );
        }
    },
    
    /*
     * Used to map an incoming list item to property setters on the control
     * class indicated by itemClass. The map specifies a relationship between
     * control property getter/setter functions and the item. This map
     * can take several forms:
     *
     * 1. A simple string like "foo". This indicates that the item itself
     *    should be passed to the control property called foo().
     * 2. A JavaScript dictionary with entries of the form
     *        { controlProperty: itemProperty }
     *    For each entry, the indicated item.itemProperty will be passed to
     *    or from the corresponding control.controlProperty().
     * 3. A function of the form:
     *
     *      function foo( item ) { ... }
     *
     *    If item is undefined, the map function is being invoked as a getter,
     *    and should extract the item from the control (available via "this").
     *    If item is defined, the map function is being invoked as a setter, and
     *    should pass the item to the control (e.g., by setting properties on
     *    it).
     *
     * If no map function is identified, a default map function is used. This
     * function does the following:
     * * If the item is a plain JavaScript object with keys of the form
     *       { property: value }
     *   The indicate value will be passed to and from control.property()
     * * Otherwise, the item is passed to and from the control's content()
     *   property.
     */
    mapFunction: Control.property( function() {
        // TODO: Before storing new mapFunction, use old one to extract items
        // if the list is dirty. For now, if the mapFunction of a dirty list is
        // updated, the unsaved changes are thrown away.
        var items = this._itemsCache();
        this.items( items );    // Force refresh.
    }),

    /*
     * Remove the item at the indicated index.
     */
    removeItemAt: Control.iterator( function( index ) {
        var items = this._itemsCache();
        if ( index >= 0 && index < items.length ) {
            // Remove the control at that index.
            this.children().eq( index ).remove();
            // Remove our cached copy of the corresponding item.
            items.splice( index, 1 );
        }
    }),
    
    /*
     * Create a control for each item in the items array. Subclasses can override
     * this is they want to perform additional work when controls are being
     * created.
     */
    _createControlsForItems: function( items ) {

        var itemsCount = items.length;
        var itemClass = this.itemClass();
        var mapFunction = this._getMapFunction();

        // Create (or reuse) a control for each item.
        var $existingControls = this.controls();
        var existingControlsCount = $existingControls.length;
        var $control;
        var i = 0;
        for ( ; i < itemsCount && i < existingControlsCount; i++ ) {
            $control = $existingControls.eq( i );
            this._mapAndSetup( $control, items[i], mapFunction );
        }

        // Create new controls for additional items.
        var newControls = [];
        for ( ; i < itemsCount; i++ ) {
            $control = itemClass.create();
            this._mapAndSetup( $control, items[i], mapFunction );
            newControls.push( $control[0] );
        }
        if ( newControls.length > 0 ) {
            this.append.apply( this, newControls );
        }

        // Remove leftover controls.
        var leftoverControls = $existingControls.slice( items.length );
        if ( leftoverControls.length > 0 ) {
            $( leftoverControls ).remove();
        }

        return this;
    },
    
    /*
     * Reconstruct the set of items from the controls.
     */
    _getItemsFromControls: function() {
        var mapFunction = this._getMapFunction();
        return this.controls().map( function( index, element ) {
            var $control = $( element ).control();
            return mapFunction.call( $control );
        }).get();
    },
    
    /*
     * Return a map function that can be applied to a control to get/set its
     * corresponding item. See mapFunction() for a description of the supported
     * means of identifying the map function.
     */
    _getMapFunction: function() {
        var mapFunction = this.mapFunction();
        if ( mapFunction === undefined ) {
            // No map function supplied; used the default.
            return List._defaultMapFunction;
        } else if ( typeof mapFunction === "string" ) {
            // The map function should invoke the property with the given name.
            return function( item ) {
                return this[ mapFunction ]( item );
            }
        } else if ( $.isFunction( mapFunction) ) {
            // An explicit map function has been supplied; use that.
            return mapFunction;
        } else {
            // An dictionary map has been supplied; return a function that
            // lets it map item members -> control properties and vice versa.
            return function( item ) {
                return List._applyDictionaryMap.call( this, mapFunction, item );
            }
        }
    },
    
    // A copy of the items the last time they were created or refreshed.
    _itemsCache: Control.property(),

    // Apply the map function and let the control set itself up.
    _mapAndSetup: function( $control, item, mapFunction ) {
        if ( mapFunction === undefined ) {
            mapFunction = this._getMapFunction();
        }
        mapFunction.call( $control, item );
        this._setupControl( $control );
    },
    
    /*
     * This can be extended by subclasses who want to perform per-control
     * set-up.
     */
    _setupControl: function( $control ) {}

});

List.extend({
    
    /*
     * Apply a simple dictionary map to the given item. The map should contain
     * a mapping of { controlProperty: itemProperty } entries. When invoked as
     * a setter, this invokes
     *    control.controlProperty( item.itemProperty )
     * When invokes as a getter, this returns a new object with keys of the form
     *    { itemProperty: control.controlProperty() }
     *
     * Note: This function should be called with this = the given control.
     */
    _applyDictionaryMap: function( map, item ) {
        if ( item === undefined ) {
            // Getter
            var result = {};
            for ( key in map ) {
                var propertyName = map[ key ];
                var value = this[ propertyName ]();
                result[ propertyName ] = value;
            }
            return result;
        } else {
            // Setter
            for ( key in map ) {
                var propertyName = map[ key ];
                var value = item[ key ];
                this[ propertyName ]( value );
            }
        }
    },
    
    /*
     * This map function is used if the host does not provide one.
     */
    _defaultMapFunction: function( item ) {
        var map;
        if ( item === undefined ) {
            // Getter
            map = this.data( "_map" );
            if ( map ) {
                // Reconstruct an item using the previously-generated map.
                return List._applyDictionaryMap.call( this, map );
            } else {
                return this.content();
            }
        } else {
            // Setter
            if ( $.isPlainObject( item ) ) {
                // Generate a map from the item and save it for later use.
                map = {};
                for ( key in item ) {
                    if ( item.hasOwnProperty( key ) ) {
                        map[ key ] = key;
                    }
                }
                this.data( "_map", map );
                List._applyDictionaryMap.call( this, map, item );
            } else {
                // Map to content()
                return this.content( item );
            }
        }
    }

})

/*
A list box that allows single selection.
The user can select an item with the mouse or keyboard.
*/
var ListBox = List.sub({
    className: "ListBox",
    inherited: {
        generic: "true"
    }
});
ListBox.prototype.extend({
  
    /*
     * True if clicking on the list background (if there aren't enough
     * items to fill the list's available space) will deselect the
     * currently-selected item. Default is true.
     */
    deselectOnBackgroundClick: Control.property.bool( null, true ),
    
    /*
     * True if the operating system-dependent "highlight" CSS classes should
     * be applied to a generic selected item. Default is true.
     */
    highlightSelection: Control.property.bool( function( highlightSelection ) {
        this.toggleClass( "highlightSelection", highlightSelection );
    }),
    
    initialize: function() {
        
        /*
         * Try to convince the browser that the list is focusable, but without
         * forcing it into the tab order (as a positive tabindex would do).
         * Firefox, Chrome, and IE seem to handle this as desired if tabindex
         * is set to a negative number.
         */
        this.attr( "tabindex", "-1" );
        
        var self = this;
        this.on({
            click: function( event ) {
                if ( event.target === self[0] ) {
                    /* User clicked the list box's background. */
                    if ( self.deselectOnBackgroundClick() ) {
                        self.selectedControl( null );
                    }
                } else {
                    var control = self._getControlContainingElement( event.target );
                    if ( control ) {
                        self._controlClick( control );
                    }
                }
            },
            keydown: function( event ) {
                self._keydown( event );
            }
        });
        
        // By default, highlight the selection.
        if ( this.highlightSelection() === undefined ) {
            this.highlightSelection( true );
        }
    },
    
    /*
     * The array of items shown in the list box.
     */
    items: function( value ) {
        /* Preserve selection index when items change */ 
        var previousIndex = this.selectedIndex();
        var result = this._super( value );
        if ( value !== undefined && value.length > 0 ) {
            var index = ( previousIndex >= 0 && previousIndex < value.length )
                ? previousIndex     // Restore previous selection.
                : -1;               // Nothing will be selected.
            this.selectedIndex( index );
        }
        return result;
    },
    
    /*
     * Toggles the selected state of a control in the list.
     * 
     * If the select parameter is true, this applies the "selected" class to the
     * control, which the list uses to track which control is selected. If the
     * control supports a selected() function, that will be invoked as well.
     * Subclasses can perform additional manipulations here.
     */
    selectControl: function( control, select ) {
        control.toggleClass( "selected", select );
        if ( $.isFunction( control.selected ) ) {
            control.selected( select );
        }
    },
    
    /*
     * The control in the list which is currently selected.
     */
    selectedControl: Control.iterator( function( selectedControl ) {
        if ( selectedControl === undefined ) {
            var control = this.controls().filter( ".selected" ).eq(0);
            return control.length > 0
                ? control
                : null;
        } else {
            var previousControl = this.selectedControl();
            var selectedElement = selectedControl ? selectedControl[0] : null;
            var self = this;
            this.controls().eachControl( function( index, control) {
                self.selectControl( control, control[0] === selectedElement );
            });
            if ( selectedControl ) {
                this._scrollToControl( selectedControl );
            }
            if ( selectedControl !== previousControl ) {
                this.trigger( "selectionChanged" );
            }
        }
    }),
    
    /*
     * The index of the currently-selected control.
     */
    selectedIndex: Control.iterator( function( selectedIndex ) {
        var controls = this.controls();
        if ( selectedIndex === undefined ) {
            var control = this.selectedControl();
            return control
                ? controls.index( control )
                : -1;
        } else {
            var index = parseInt( selectedIndex );
            var control = ( index >= 0 && index < controls.length )
                ? controls.eq( index )
                : null;
            this.selectedControl( control );
        }
    }),
    
    /*
     * The item represented by the currently-selected control.
     */
    selectedItem: Control.iterator( function( selectedItem ) {
        if ( selectedItem === undefined ) {
            var index = this.selectedIndex();
            return index >= 0
                ? this.items()[ index ]
                : null;
        } else {
            var index = $.inArray( selectedItem, this.items() );
            this.selectedIndex( index );
        }
    }),
    
    _controlClick: function( control ) {
        this.selectedControl( control );
    },
    
    _getControlContainingElement: function( element ) {
        return $( element ).closest( this.controls() ).control();
    },
    
    /*
     * Return the control that spans the given y position, or -1 if not found.
     * If downward is true, move down the list of controls to find the
     * first control found at the given y position; if downward is false,
     * move up the list of controls to find the last control at that position. 
     */
    _getControlAtY: function( y, downward ) {
        
        var controls = this.controls();
        var start = downward ? 0 : controls.length - 1;
        var end = downward ? controls.length : 0;
        var step = downward ? 1 : -1;
        for ( var i = start; i !== end; i += step ) {
            var $control = controls.eq(i);
            var controlTop = Math.round( $control.offset().top );
            var controlBottom = controlTop + $control.outerHeight();
            if ( controlTop <= y && controlBottom >= y ) {
                return i;
            }
        }
        
        return -1;
    },
    
    /*
     * Handle a keydown event.
     */
    _keydown: function( event ) {
        
        var handled;
        switch ( event.which ) {

            case 33: // Page Up
                handled = this._pageUp();
                break;
                
            case 34: // Page Down
                handled = this._pageDown();
                break;
            
            case 35: // End
                handled = this._selectLastControl();
                break;
            
            case 36: // Home
                handled = this._selectFirstControl();
                break;

            case 37: // Left
                if ( this._selectedControlIsInline() ) {
                    handled = this._selectPreviousControl();
                }
                break;
            
            case 38: // Up
                handled = event.altKey
                    ? this._selectFirstControl()
                    : this._selectPreviousControl();
                break;

            case 39: // Right
                if ( this._selectedControlIsInline() ) {
                    handled = this._selectNextControl();
                }
                break;
                
            case 40: // Down
                handled = event.altKey
                    ? this._selectLastControl()
                    : this._selectNextControl();
                break;
                
            default:
                handled = false;
                break;
        }
        
        if (handled)
        {
            event.stopPropagation();
            event.preventDefault();
        }
    },
    
    _pageDown: function() {
        return this._scrollOnePage( true );
    },
    
    _pageUp: function() {
        return this._scrollOnePage( false );
    },
    
    /*
     * Move by one page downward (if downward is true), or upward (if false).
     */
    _scrollOnePage: function( downward ) {

        var selectedIndex = this.selectedIndex();
        
        // Find the control at the bottom/top edge of the viewport.
        var viewPortDimensions = this._viewPortDimensions();
        var edge = downward ? viewPortDimensions.bottom : viewPortDimensions.top;
        var index = this._getControlAtY( edge, downward );
        
        if ( index >= 0 && selectedIndex === index ) {
            // The control at that edge is already selected.
            // Move one page further down/up.
            var delta = downward
                ? viewPortDimensions.height
                : -viewPortDimensions.height; 
            index = this._getControlAtY( edge + delta, downward );
        }

        if ( index < 0 ) {
            // Would have scrolled too far in that direction.
            // Just select the last/first control.
            index = downward
                ? this.controls().length - 1
                : 0;
        }
        
        if ( index !== this.selectedIndex() ) {
            this.selectedIndex( index );
            return true;
        }
        
        return false;
    },
    
    /*
     * Scroll the given control into view.
     */
    _scrollToControl: function( $control ) {

        var controlTop = $control.offset().top;
        var controlBottom = controlTop + $control.outerHeight();

        var viewPortDimensions = this._viewPortDimensions();
        var scrollTop = this.scrollTop();
        
        if ( controlBottom > viewPortDimensions.bottom ) {
            // Scroll up until control is entirely visible.
            this.scrollTop( scrollTop + controlBottom - viewPortDimensions.bottom );
        } else if ( controlTop < viewPortDimensions.top ) {
            // Scroll down until control is entirely visible.
            this.scrollTop( scrollTop - ( viewPortDimensions.top - controlTop ) );
        }
    },

    /*
     * Return true if the selected control is displayed inline.
     */
    _selectedControlIsInline: function() {
        var selectedControl = this.selectedControl();
        var inline = false;
        if ( selectedControl ) {
            var display = selectedControl.css( "display" );
            inline = $.inArray( display, [
                "inline",
                "inline-block",
                "inline-table"
            ]) >= 0;
        }
        return inline;
    },
    
    _selectFirstControl: function() {
        if ( this.controls().length > 0 ) {
            this.selectedIndex( 0 );
            /*
             * The list will have already scrolled the first control into view,
             * but if the list has top padding, the scroll won't be all the way
             * at the top. So, as a special case, force it to the top.
             */
            this.scrollTop( 0 );
            return true;
        }
        return false;
    },
    
    _selectLastControl: function() {
        if ( this.controls().length > 0 ) {
            this.selectedIndex( this.controls().length - 1 );
            return true;
        }
        return false;
    },
    
    _selectNextControl: function() {
        var index = this.selectedIndex() + 1;
        if ( index < this.controls().length ) {
            this.selectedIndex( index );
            return true;
        }
        return false;
    },
    
    _selectPreviousControl: function() {
        var index = this.selectedIndex() - 1;
        if ( index >= 0 && this.controls().length > 0 ) {
            this.selectedIndex( index );
            return true;
        }
        return false;
    },
    
    _viewPortDimensions: function() {
        var viewPortTop = this.offset().top;
        var viewPortHeight = this.height();
        return {
            top: viewPortTop,
            height: viewPortHeight,
            bottom: viewPortTop + viewPortHeight
        };
    }
    
});

/*
A list whose selected item can show additional information.

By default, this control expects items to be a dictionary of the form:

{
    description: (content, usually a single line, that's always visible)
    content: (expanded content that appears when an item is selected)
}

*/
var ListInlay = ListBox.sub({
    className: "ListInlay",
    inherited: {
        itemClass: "Collapsible",
        highlightSelection: "false"
    }
});
ListInlay.prototype.extend({
    
    initialize: function() {
        this.mapFunction({
            description: "heading",
            content: "content"
        });
    },

    selectControl: function( control, select ) {
        this._super( control, select );
        if ( select ) {
            control.toggleCollapse();
        } else {
            control.collapsed( true );
        }
    },
    
    _setupControl: function( control ) {
        // Let ListBox manage toggling instead of Collapsible
        control.toggleOnClick( false );
    }
    
});

/*
Generates Lorem Ipsum placeholder paragraphs.
*/
var LoremIpsum = Control.sub({
    className: "LoremIpsum"
});
LoremIpsum.prototype.extend({
    
    initialize: function() {
        if ( !LoremIpsum._usedLorem ) {
            // This is the first LoremIpsum control instance, so it gets
            // the special lead sentence by default.
            this.lorem( true );
            LoremIpsum._usedLorem = true;
        }
        var content = this.content();
        if ( content && content.length === 0 ) {
            this._refresh();
        }
    },
    
    /*
     * True if the first sentence should definitely be (or not be)
     * the standard "Lorem ipsum dolor sit amet..." If this is undefined,
     * the first instance of this control class will start with this sentence;
     * subsequent instances won't.
     */
    lorem: Control.property.bool( function() {
        this._refresh();
    }),
    
    /*
     * The number of paragraphs to show. Default is one paragraph.
     */
    paragraphs: Control.property.integer( function( paragraphs ) {
        this._refresh();
    }, 1),
    
    /*
     * A specific number of sentences to show per paragraph.
     * If not set, each paragraph will have a variable number of sentences.
     */
    sentences: Control.property.integer( function( sentences ) {
        this._refresh();
    }),

    /*
     * Generate a random paragraph.
     */    
    _generateParagraph: function( useLorem ) {
        
        // Default is 5 and 12 sentences per paragraph.
        var sentenceCount = this.sentences() || Math.floor( Math.random() * 8 ) + 5;
        var sentencesAvailable = LoremIpsum.sentences.length;
        
        var paragraph = "";
        if ( sentenceCount > 0 ) {
            
            // Use special first sentence?
            if ( useLorem ) {
                paragraph = LoremIpsum.loremSentence;
                sentenceCount--;
            }
            
            // Pick remaining sentences.
            for ( var i = 0; i < sentenceCount; i++ ) {
                if ( paragraph.length > 0 ) {
                    paragraph += " ";
                }
                var sentenceIndex = Math.floor( Math.random() * ( sentencesAvailable) );
                paragraph += LoremIpsum.sentences[ sentenceIndex ];
            }
        }
        paragraph = "<p>" + paragraph + "</p>";
        
        return paragraph;
    },
    
    _refresh: function() {
        var content = [];
        for ( var i = 0, length = this.paragraphs(); i < length; i++ ) {
            var useLorem = ( i === 0 && this.lorem() );
            var paragraph = this._generateParagraph( useLorem );
            content.push( paragraph );
        }
        this.content( content );
    }
    
});

// Class members
LoremIpsum.extend({
    
    loremSentence: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", 
    
    sentences: [
        "Duis et adipiscing mi.",
        "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        "Mauris vestibulum orci sed justo lobortis viverra.",
        "Suspendisse blandit dolor nunc, nec facilisis metus.",
        "Ut vestibulum ornare eros id vestibulum.",
        "Phasellus aliquam pellentesque urna, eu ullamcorper odio sollicitudin vel.",
        "Aliquam lacinia dolor at elit viverra ullamcorper.",
        "Vestibulum ac quam augue.",
        "Fusce tortor risus, commodo in molestie vitae, rutrum eu metus.",
        "Nunc tellus justo, consequat in ultrices elementum, gravida a mi.",
        "Praesent in lorem erat, quis dictum magna.",
        "Aenean et eros ligula, quis sodales justo.",
        "Quisque egestas imperdiet dignissim.",
        "Aenean commodo nulla sit amet urna ornare quis dignissim libero tristique.",
        "Praesent non justo metus.",
        "Nam ut adipiscing enim.",
        "In hac habitasse platea dictumst.",
        "Nulla et enim sit amet leo laoreet lacinia ut molestie magna.",
        "Vestibulum bibendum venenatis eros sit amet eleifend.",
        "Fusce eget metus orci.",
        "Fusce tincidunt laoreet lacinia.",
        "Proin a arcu purus, nec semper quam.",
        "Mauris viverra vestibulum sagittis.",
        "Ut commodo, dolor malesuada aliquet lacinia, dui est congue massa, vel sagittis metus quam vel elit.",
        "Nulla vel condimentum odio.",
        "Aliquam cursus velit ut tellus ultrices rutrum.",
        "Vivamus sollicitudin rhoncus purus, luctus lobortis dui viverra vitae.",
        "Nam mauris elit, aliquet at congue sed, volutpat feugiat eros.",
        "Nulla quis nulla ac lectus dapibus viverra.",
        "Pellentesque commodo mauris vitae sapien molestie sit amet pharetra quam pretium.",
        "Maecenas scelerisque rhoncus risus, in pharetra dui euismod ac.",
        "Mauris ut turpis sapien, sed molestie odio.",
        "Vivamus nec lectus nunc, vel ultricies felis.",
        "Mauris iaculis rhoncus dictum.",
        "Vivamus at mi tellus.",
        "Etiam nec dui eu risus placerat adipiscing non at nisl.",
        "Curabitur commodo nunc accumsan purus hendrerit mollis.",
        "Fusce lacinia urna nec eros consequat sed tempus mi rhoncus.",
        "Morbi eu tortor sit amet tortor elementum dapibus.",
        "Suspendisse tincidunt lorem quis urna sollicitudin lobortis.",
        "Nam eu ante ut tellus vulputate ultrices eu sed mi.",
        "Aliquam lobortis ultricies urna, in imperdiet lacus tempus a.",
        "Duis nec velit eros, ut volutpat neque.",
        "Sed quam purus, tempus vitae porta eget, porta sit amet eros.",
        "Vestibulum dignissim ullamcorper est id molestie.",
        "Nunc erat ante, lobortis id dictum in, ultrices sit amet nisl.",
        "Nunc blandit pellentesque sapien, quis egestas risus auctor quis.",
        "Fusce quam quam, ultrices quis convallis sed, pulvinar auctor tellus.",
        "Etiam dolor velit, hendrerit et auctor sit amet, ornare nec erat.",
        "Nam tellus mi, rutrum a pretium et, dignissim sed sapien.",
        "Sed accumsan dapibus ipsum ut facilisis.",
        "Curabitur vel diam massa, ut ultrices est.",
        "Sed nec nunc arcu.",
        "Nullam lobortis, enim nec gravida molestie, orci risus blandit orci, et suscipit nunc odio eget nisl.",
        "Praesent lectus tellus, gravida ut sagittis non, convallis a leo.",
        "Mauris tempus feugiat fermentum.",
        "Phasellus nibh mi, convallis eu pulvinar eget, posuere in nunc.",
        "Morbi volutpat laoreet mauris vel porta.",
        "Aenean vel venenatis nisi.",
        "Ut tristique mauris sed libero malesuada quis rhoncus augue convallis.",
        "Fusce pellentesque turpis arcu.",
        "Nunc bibendum, odio id faucibus malesuada, diam leo congue urna, sed sodales orci turpis id sem.",
        "Ut convallis fringilla dapibus.",
        "Ut quis orci magna.",
        "Mauris nec erat massa, vitae pellentesque tortor.",
        "Sed in ipsum nec enim feugiat aliquam et id arcu.",
        "Nunc ut massa sit amet nisl semper ultrices eu id lacus.",
        "Integer eleifend aliquam interdum.",
        "Cras a sapien sapien.",
        "Duis non orci lacus.",
        "Integer commodo pharetra nulla eget ultrices.",
        "Etiam congue, enim at vehicula posuere, urna lorem hendrerit erat, id condimentum quam lectus ac ipsum.",
        "Aliquam lorem purus, tempor ac mollis in, varius eget metus.",
        "Nam faucibus accumsan sapien vitae ultrices.",
        "Morbi justo velit, bibendum non porta vel, tristique quis odio.",
        "In id neque augue.",
        "Cras interdum felis sed dui ultricies laoreet sit amet eu elit.",
        "Vestibulum condimentum arcu in massa lobortis vitae blandit neque mattis.",
        "Nulla imperdiet luctus mollis.",
        "Donec eget lorem ipsum, eu posuere mi.",
        "Duis lorem est, iaculis sit amet molestie a, tincidunt rutrum magna.",
        "Integer facilisis suscipit tortor, id facilisis urna dictum et.",
        "Suspendisse potenti.",
        "Aenean et mollis arcu.",
        "Nullam at nulla risus, vitae fermentum nisl.",
        "Nunc faucibus porta volutpat.",
        "Sed pretium semper libero, vitae luctus erat lacinia vel.",
        "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        "Integer facilisis tempus tellus, rhoncus pretium orci semper sed.",
        "Morbi non lectus leo, quis semper diam.",
        "Suspendisse ac urna massa, vitae egestas metus.",
        "Pellentesque viverra mattis semper.",
        "Cras tristique bibendum leo, laoreet ultrices urna condimentum at.",
        "Praesent at tincidunt velit.",
        "Nam fringilla nibh quis nulla volutpat lacinia.",
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Sed ultrices sollicitudin neque ut molestie.",
        "Sed at lectus in lacus scelerisque suscipit non id risus.",
        "Aliquam lorem nibh, convallis vitae molestie in, commodo feugiat nibh."
    ],
    
    _usedLorem: false
})

/*
A standard menu bar.

Note: The menu bar places a Overlay instance underneath itself to absorb
clicks outside the menu. If you're using a MenuBar on a page with elements
that have an explicit z-index, you'll want to give the MenuBar a higher z-index
so that it (and its overlay) end up above all other elements when any menus
are open. See notes in the source for the Overlay class.
*/
var MenuBar = Control.sub({
    className: "MenuBar",
    inherited: {
        generic: "true"
    }
});
MenuBar.prototype.extend({
    
    /*
     * Close currently open any menus.
     */
    close: Control.iterator( function() {
        if ( !this.opened() ) {
            // Already closed
            return;
        }
        
        var $overlay = this._overlay();
        if ( $overlay ) {
            $overlay.remove();
            this._overlay( null );
        }
        
        this
            ._closeOpenPopups()
            .opened( false );
    }),
    
    /*
     * The menus in the menu bar. These are typically PopupSource controls,
     * including subclasses like Menu. Other types of controls can be
     * safely placed in the content as well.
     */
    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined ) {
            // Since we're managing our own overlay, we suppress the overlays
            // on the individual menus in our content.
            var popups = this.find( ".PopupSource" ).control();
            if ( popups ) {
                popups.overlayClass( null );
            }
        }
        return result;
    },
    
    initialize: function() {
        var self = this;
        this.on({
            "closed canceled": function( event ) {
                if ( self._openPopups() == null ) {
                    // No longer any open popups.
                    self.close();
                }
            },
            opened: function( event ) {
                self.open();
                // Close open popups other than the one which just opened.
                var newMenu = $( event.target ).closest( ".PopupSource" ).control();
                self._closeOpenPopups( newMenu );
            }
        });
        this.on( "mouseenter", ".PopupSource", function( event ) {
            if ( self.opened() ) {
                // Riffing: Implicitly open the popup the user hovered into
                // if it's not already open.
                var newMenu = $( event.target ).closest( ".PopupSource" ).control();
                if ( newMenu && !newMenu.opened() ) {
                    newMenu.open();
                }
            }
        });
    },
    
    /*
     * Returns true if any of the menu bar's menus are currently open.
     */
    opened: Control.chain( "applyClass/opened" ),
    
    open: Control.iterator( function() {
        
        if ( this.opened() ) {
            // Already open
            return;
        }
        
        var $overlay = Overlay.create().target( this );
        this._overlay( $overlay );
        
        this.opened( true );
    }),
    
    /*
     * Close open popups. If a keepPopup is specified, leave that menu open.
     */
    _closeOpenPopups: function( keepPopup ) {
        var openMenus = this._openPopups();
        if ( openMenus ) {
            openMenus = openMenus.not( keepPopup );
            if ( openMenus.length > 0 ) {
                openMenus.close();
            }
        }
        return this;
    },
    
    /*
     * Return the currently open popups.
     */
    _openPopups: Control.chain( "children", "filter/.PopupSource.opened", "control" ),

    // The overlay behind the menu bar.    
    _overlay: Control.property(),

    // Hint for documentation tools.
    _requiresClasses: [ "Menu", "Overlay" ]
    
});

/* A command in a Menu. */
var MenuItem = Control.sub({
    className: "MenuItem",
    inherited: {
        generic: "true"
    }
});
MenuItem.prototype.extend({

    /*
     * True if the menu item is disabled. The default is false.
     */
    disabled: Control.chain( "applyClass/disabled" ),

    initialize: function() {
        var self = this;
        this.click( function( event ) {
            if ( self.disabled() ) {
                return false;
            }
        });
    }

});

/* A line separating the MenuItems controls in a Menu. */
var MenuSeparator = Control.sub({
    className: "MenuSeparator"
});

/* The name of the current month, globalized. */
var MonthName = Control.sub({
    className: "MonthName",
    tag: "span"
});
MonthName.prototype.extend({

    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this.month( this.month() );
        }
        return result;
    },
    
    initialize: function() {
        if ( !this.month() ) {
            var today = new Date();
            this.month( today.getMonth() );
        }
    },
    
    /*
     * The index of the month to show: 0 = January, 1 = February, etc.
     */
    month: Control.property( function( month ) {
        var culture = this.culture();
        var monthNameEnum = culture ? culture.calendar.months.names : MonthName.names;
        this.content( monthNameEnum[ month ] );
    })
    
});

// Class methods
MonthName.extend({
    
    // Default names, used if Globalize is not avaialble.
    names: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    
});

/*
A ListBox capable of multiple selection.
*/
var MultiListBox = ListBox.sub({
    className: "MultiListBox",
    inherited: {
    }
});
MultiListBox.prototype.extend({
    
    /*
     * The controls in the list which are currently selected.
     */
    selectedControls: Control.iterator( function( selectedControls ) {
        if ( selectedControls === undefined ) {
            return this.controls().filter( ".selected" );
        } else {
            var self = this;
            this.controls().eachControl( function( index, control ) {
                var filter = selectedControls.filter( control );
                var select = ( filter && filter.length > 0 );
                self.selectControl( control, select );
            });
            this.trigger( "selectionChanged" );
        }
    }),
    
    /*
     * The indices of the currently-selected controls.
     */
    selectedIndices: Control.iterator( function( selectedIndices ) {
        var controls = this.controls();
        if ( selectedIndices === undefined ) {
            var indices = [];
            for ( var i = 0; i < controls.length; i++ ) {
                if ( controls.eq(i).hasClass( "selected" ) ) {
                    indices.push( i );
                }
            }
            return indices;
        } else {
            var selectedControls = [];
            if ( selectedIndices ) {
                for ( var i = 0; i < selectedIndices.length; i++ ) {
                    var index = selectedIndices[i];
                    selectedControls.push( controls[ index ] );
                }
            }
            this.selectedControls( selectedControls );
        }
    }),
    
    /*
     * The items represented by the currently-selected controls.
     */
    selectedItems: Control.iterator( function( selectedItems ) {
        if ( selectedItems === undefined ) {
            var indices = this.selectedIndices();
            var items = this.items();
            var selectedItems = [];
            for ( var i = 0; i < indices.length; i++ ) {
                var index = indices[i];
                selectedItems.push( items[i] );
            }
            return selectedItems;
        } else {
            var selectedControls = [];
            if ( selectedItems ) {
                var controls = this.controls();
                var items = this.items();
                for ( var i = 0; i < selectedItems.length; i++ ) {
                    var item = selectedItems[i];
                    var index = $.inArray( item, items );
                    if ( index >= 0 ) {
                        selectedControls.push( controls[ index ] );
                    }
                }
            }
            this.selectedControls( selectedControls );
        }
    }),
    
    /*
     * Toggle the selected state of the given control (if toggle is undefined),
     * or set the selected state to the indicated toggle value.
     */
    toggleControl: function( control, toggle ) {
        var toggle = toggle || !control.hasClass( "selected" );
        this.selectControl( control, toggle );
        this.trigger( "selectionChanged" );
        return this;
    },
    
    _controlClick: function( control ) {
        this.toggleControl( control );
    }

});

/*
A list whose selected items can show additional information.

By default, this control expects items to be a dictionary of the form:

{
    description: (content, usually a single line, that's always visible)
    content: (expanded content that appears when an item is selected)
}

This is the multiple-selection variation of ListInlay.

*/
var MultiListInlay = MultiListBox.sub({
    className: "MultiListInlay",
    inherited: {
        itemClass: "CollapsibleWithHeadingButton",
        highlightSelection: "false"
    }
});
MultiListInlay.prototype.extend({
    
    initialize: function() {
        this.mapFunction( function( item ) {
            if ( item === undefined ) {
                return {
                    description: this.heading(),
                    content: this.content()
                };
            } else {
                this
                    .heading( item.description )
                    .content( item.content );
                if ( this instanceof Collapsible ) {
                    // Let ListBox manage toggling instead of Collapsible
                    this.toggleOnClick( false );
                }
            }
        });
    },
    
    selectControl: function( control, select ) {
        this._super( control, select );
        control.collapsed( !select );
    }
});

/*
A control that covers the entire viewport, typically to swallow clicks.
*/
var Overlay = Control.sub({
    className: "Overlay",
    inherited: {
        generic: "true"
    }
});
Overlay.prototype.extend({
    
    /*
     * The target of the overlay is the element which will end up visually
     * in front of the overlay.
     * 
     * Setting the target adds the overlay to the DOM (or moves it, if already
     * in the DOM) to come before the target element. The result of this is that
     * the overlay will sit visually behind the target.
     * 
     * If there are elements with a z-index in the same stacking context as the
     * target, the target should also have a z-index applied to it. The
     * overlay will pick up this same z-index. As long as the target element
     * visually appears in front of the other elements, so too will the overlay.
     */
    target: Control.property( function( target ) {
        
        if ( target === null ) {
            // Clearing target; nothing to do right now.
            return;
        }
        
        var targetZIndex = parseInt( target.css( "z-index" ) ); 
        if ( targetZIndex ) {
            // Overlay gets same z-index as target.
            this.css( "z-index", targetZIndex );
        }
        
        return this.insertBefore( target );
    })
    
});

/*
Pack children into columns.

The number of columns is variable, and is determined by diving the control's
available width by the column width (which is taken from the width of the
first child).
*/
var PackedColumns = Control.sub({
    className: "PackedColumns"
});
PackedColumns.prototype.extend({
    
    /*
     * True if the columns should be centered. Default is false.
     */
    center: Control.property.bool( function() {
        if ( this.inDocument() ) {
            this.layout();
        }
    }),
    
    content: function( value ) {
        var result = this._super( value ); 
        this.checkForSizeChange();
        return result;
    },
    
    initialize: function() {
        var self = this;
        this.on( "layout sizeChanged", function() {
            self.layout();
        });
    },
    
    layout: function() {
        
        var children = this.children();
        var childCount = children.length;
        if ( childCount === 0 ) {
            return;
        }
        
        // Infer column width and inter-child margins from first child.
        var firstChild = children.eq(0);
        var columnWidth = firstChild.outerWidth();
        if ( columnWidth === 0 ) {
            return; // No width; perhaps child will load later.
        }
        var marginRight = parseInt( firstChild.css( "margin-right" ) );
        var marginBottom = parseInt( firstChild.css( "margin-bottom" ) );
        
        var availableWidth = this.width();
        var columns = Math.max(
                        Math.floor( ( availableWidth + marginRight )
                            / ( columnWidth + marginRight ) ),
                        1);

        var consumedWidth = columns * columnWidth
                            + ( columns - 1 ) * marginRight;
        var leftover = Math.max( availableWidth - consumedWidth, 0 );
        var offsetX = this.center()
            ? leftover / 2
            : 0;
        
        var columnHeight = [];
        for ( var childIndex = 0; childIndex < childCount; childIndex++ ) {
            
            // Find shortest column
            var shortestColumn = 0;
            for ( var column = 1; column < columns; column++ ) {
                var height = columnHeight[ column ] || 0;
                if ( height < columnHeight[ shortestColumn ] ) {
                    shortestColumn = column;
                }
            }
            
            // Add the current child to the shortest column
            var x = shortestColumn * ( columnWidth + marginRight ) + offsetX;
            var y = columnHeight[ shortestColumn ] || 0;
            var child = children.eq( childIndex );
            child.css({
                left: x,
                top: y
            });
            columnHeight[ shortestColumn ] = y + child.outerHeight() + marginBottom;
        }
    }
    
});

/* General base class for pages. */
var Page = Control.sub({
    className: "Page",
    inherited: {
        generic: "true"
    }
});
Page.prototype.extend({
    
    /*
     * True if the page should fill its container. Default is false.
     */
    fill: Control.chain( "applyClass/fill" ),

    initialize: function() {
        // Force a refresh of the page title. Subclasses may want to handle the
        // title specially (e.g., to reflect it as a heading on the page), and
        // this gives them a chance to do that.
        this.title( this.title() );
    },
    
    /*
     * The URL parameters for the current page. Read-only.
     */
    urlParameters: function() {
        return Page.urlParameters();
    },
        
    /*
     * The title of the page. This will generally be shown in the browser's
     * window title bar, etc.
     */
    title: function( title ) {
        if ( this[0] === document.body ) {
            // This page is the document, mirror the document's title.
            if ( title === undefined ) {
                return document.title;
            } else {
                document.title = title;
                return this;
            }
        } else {
            // This page is not (yet) the document, keep a private copy of the title.
            return this._title( title );
        }
    },

    // Private copy of the page's title.
    _title: Control.property()

});

/*
 * Class members.
 */
Page.extend({

    /*
     * Start actively tracking changes in a page specified on the URL.
     * For a URL like www.example.com/index.html#page=Foo, load class Foo.
     * If the page then navigates to www.example.com/index.html#page=Bar, this
     * will load class Bar in situ, without forcing the browser to reload the page. 
     */
    trackClassFromUrl: function( defaultPageClass, target ) {
        
        var $control = Control( target || "body" );
        
        // Watch for changes in the URL after the hash.
        $( window ).hashchange( function() {
            var pageClass = Page.urlParameters().page || defaultPageClass;
            $control.transmute( pageClass );
        })
            
        // Trigger a page class load now.
        $( window ).hashchange();
    },
    
    /*
     * Return the URL parameters (after "&" and/or "#") as a JavaScript object.
     * E.g., if the URL looks like http://www.example.com/index.html?foo=hello&bar=world
     * then this returns the object
     *
     *    { foo: "hello", bar: "world" }
     *
     */
    urlParameters: function() {
        var regex = /[?#&](\w+)=([^?#&]*)/g;
        var results = {};
        var match = regex.exec( window.location.href );
        while (match != null) {
            var parameterName = match[1];
            var parameterValue = match[2];
            results[ parameterName ] = parameterValue;
            match = regex.exec( window.location.href );
        }
        return results;
    }    
    
});

/*
 * General utility functions made available to all controls.
 */
Control.prototype.extend({
    
    // Look up the page hosting a control.
    page: function() {
        // Get the containing DOM element subclassing Page that contains the element
        var pages = this.closest( ".Page" );
        
        // From the DOM element, get the associated QuickUI control.
        return ( pages.length > 0 ) ? pages.control() : null;
    }
    
});

/*
A page organized into four quadrants:
top left: typically a logo
top right: typically cross-area navigation
bottom left: typically within-area navigation
bottom right: typically main page content

The whole page scrolls as a unit.
*/
var PageWithQuadrants = Page.sub({
    className: "PageWithQuadrants",
    inherited: {
        content: [
            " ",
            {
                html: "<div class=\"table\" />",
                ref: "pageTable",
                content: [
                    " ",
                    {
                        html: "<div class=\"top row\" />",
                        content: [
                            " ",
                            {
                                html: "<div class=\"top left cell\" />",
                                ref: "PageWithQuadrants_topLeft"
                            },
                            " ",
                            {
                                html: "<div class=\"top right cell\" />",
                                ref: "PageWithQuadrants_topRight"
                            },
                            " "
                        ]
                    },
                    " ",
                    {
                        html: "<div class=\"bottom row\" />",
                        content: [
                            " ",
                            {
                                html: "<div class=\"bottom left cell\" />",
                                ref: "PageWithQuadrants_bottomLeft"
                            },
                            " ",
                            {
                                html: "<div class=\"bottom right cell\" />",
                                ref: "PageWithQuadrants_bottomRight"
                            },
                            " "
                        ]
                    },
                    " "
                ]
            },
            " "
        ]
    }
});
PageWithQuadrants.prototype.extend({
    topLeft: Control.chain( "$PageWithQuadrants_topLeft", "content" ),
    topRight: Control.chain( "$PageWithQuadrants_topRight", "content" ), 
    bottomLeft: Control.chain( "$PageWithQuadrants_bottomLeft", "content" ),
    bottomRight: Control.chain( "$PageWithQuadrants_bottomRight", "content" ),
    
    /*
     * The main page content. This will go in the bottom right quadrant.
     */
     content: Control.chain( "bottomRight" )
});

/*
A panel arranging items horizontally; items that don't fit overflow into a menu.

The basic strategy is to keep all items on the same line, but make the ones
that don't fit invisible. When the menu button is clicked, the invisible items
are temporarily moved to the menu, then moved back when the menu is closed. 
*/
var PanelWithOverflow = Control.sub({
    className: "PanelWithOverflow",
    inherited: {
        content: [
            " ",
            {
                control: "PopupButton",
                ref: "menuButton",
                indicator: "»",
                quiet: "true"
            },
            " ",
            {
                html: "<div />",
                ref: "PanelWithOverflow_content"
            },
            " "
        ],
        generic: "true"
    }
});
PanelWithOverflow.prototype.extend({
    
    /*
     * The contents of the control.
     */
    content: Control.chain( "$PanelWithOverflow_content", "content", function() {
        this.checkForSizeChange();
    }),
    
    /*
     * The indicator used to show when contents have overflowed
     * the control's bounds.
     */
    indicator: Control.chain( "$menuButton", "indicator", function() {
        this.checkForSizeChange();
    }),
    
    initialize: function() {
        var self = this;
        this.on( "layout sizeChanged", function() {
            self.layout();
        });
        this.$menuButton().on({
            "canceled closed": function() { self._menuClosed(); },
            "opened": function() {
                self._menuOpened();
                // (Re)position the popup now that it's been populated.
                self.$menuButton().positionPopup();
            }
        });
    },
    
    /*
     * Force the control to layout its contents.
     */
    layout: Control.iterator( function() {
        
        // Don't bother laying out until we're visible, or if the popup
        // is currently open. The latter case, while it'd be nice to support,
        // quickly gets quite hairy.
        if ( !this.is( ":visible" ) || this.$menuButton().opened() ) {
            return;
        }
        
        var availableWidth = this.width();
        var showMenu = false;
        var $children = this.$PanelWithOverflow_content().children();
        
        // Work from right to left 
        for ( var i = $children.length - 1; i > 0; i-- ) {
            var $child = $children.eq(i);
            // Look at right edge, not counting right margin
            var marginLeft = parseInt( $child.css( "margin-left" ) ) || 0;
            var right = marginLeft + $child.position().left + $child.outerWidth();
            var overflowed = ( right > availableWidth );
            $child.toggleClass( "overflowed", overflowed );
            if ( overflowed ) {
                if ( !showMenu ) {
                    // Turn on menu, and allocate room for it.
                    showMenu = true;
                    availableWidth -= this.$menuButton().outerWidth( true );
                }
            } else {
                // Everything to the left fits.
                $children.slice( 0, i ).removeClass( "overflowed" );
                break;
            }
        }
        
        this.$menuButton().toggle( showMenu );
    }),
    
    _menuClosed: Control.iterator( function() {
        // Return the overflow menu's children to the main content area.
        var $overflowed = this.$menuButton().popup();
        this.$PanelWithOverflow_content().append( $overflowed );
        this.layout();
    }),
    
    _menuOpened: Control.iterator( function() {
        // Temporarily move the overflowed items into the menu.
        var content = this.$PanelWithOverflow_content().content();
        var $overflowed = $( content ).filter( ".overflowed" );
        this.$menuButton().popup( $overflowed );
    })

});

/*
A panel that can be situated in a vertically scrolling container, and which
will move up and down in the viewport, but will bump up against the top of
the viewport and remain visible instead of scrolling out of view.

The control hosts its content within a panel that can pop out of the layout
flow. To faciliate styling, the control exposes background and padding
properties that map to the corresponding properties on this inner panel.
For most complex content styling, set all content elements within a single
div or other element and style that.

Note: A PersistentPanel should generally be placed within the highest-level
scrolling element on the page; it will not work property when placed
in a scrolling element nested within some outer scrolling element.
*/
var PersistentPanel = Control.sub({
    className: "PersistentPanel",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "PersistentPanel_content"
            },
            " "
        ],
        generic: "true"
    }
});
PersistentPanel.prototype.extend({

    /*
     * The content's background. See top notes.
     */    
    background: Control.chain( "$PersistentPanel_content", "css/background" ),
    
    /*
     * The control's content.
     */
    content: Control.chain( "$PersistentPanel_content", "content", function() {
        this.checkForSizeChange();
    }),
    
    /*
     * True if the control is currently docked to the top of the viewport.
     */
    docked: Control.chain( "applyClass/docked" ),
    
    initialize: function() {
        var self = this;
        this
            .on( "layout", function() {
                if ( self.inDocument() ) {
                    self._recalc();
                }
            })
            .inDocument( function() {
                if ( !this.scrollingParent() ) {
                    // No scrolling parent has been set; look for one.
                    this.scrollingParent( this._findScrollingParent() );
                }
                this._recalc();
            });

        $( window ).resize( function() {
            self._recalc();
        });
    },
    
    /*
     * The content's padding. See top notes.
     */
    padding: Control.chain( "$PersistentPanel_content", "css/padding" ),
    
    /*
     * The parent of this control used to determine whether the control is
     * in or out of view. The default value for this property is the closest
     * parent element with overflow-y set to "auto" or "scroll".
     */
    scrollingParent: Control.property( function( scrollingParent ) {
        var self = this;
        $( scrollingParent ).scroll( function() {
            self._recalc();
        });
    }),

    _adjustSizes: function() {
        
        // Make the panel the same width as the container.
        this.$PersistentPanel_content().width( this.width() );
        
        // Make the container the same height as the panel, so that when
        // the panel pops out in fixed mode, the container can continue
        // to occupy the same amount of vertical space.
        this.height( this.$PersistentPanel_content().outerHeight( true ) );
    },
    
    /*
     * Determine which parent of the control scrolls vertically.
     */
    _findScrollingParent: function() {
        
        // By default, assume the window is what is scrolling.
        var scrollingParent = window;
        
        var parents = this.parents();
        for ( var i = 0; i < parents.length; i++ ) {
            
            if ( parents[i] === document.body ) {
                /*
                 * It doesn't appear possible to bind to the scroll event
                 * for the document body. Instead, if the body is the
                 * scrolling parent, we use the window instead, which has
                 * the same effect.
                 */
                break;
            }
            
            var overflowY = parents.eq(i).css( "overflow-y" );
            if ( overflowY === "auto" || overflowY === "scroll" ) {
                // Found a parent that explicitly asks for scrolling; use that.
                scrollingParent = parents[i];
                break;
            }
        }
        
        return scrollingParent;
    },

    /*
     * Do the real work of the control: determine whether the panel contents
     * should flow with the document, or pop out into a docked position at the
     * top or bottom of the viewport.
     */
    _recalc: function() {
        var scrollingParent = this.scrollingParent();
        if ( scrollingParent ) {
            
            var isScrollingParentWindow = ( scrollingParent === window );
            var $scrollingParent = $( scrollingParent );
            
            var scrollTop = $scrollingParent.scrollTop();
            var containerTop = this.position().top;
            var aboveViewPort = ( containerTop < scrollTop );

            var scrollBottom = scrollTop + $scrollingParent.height();
            var containerBottom = containerTop + this.height();
            var belowViewPort = ( containerBottom > scrollBottom );
            
            var dock = ( aboveViewPort || belowViewPort );

            if ( dock ) {
                /*
                 * Docking the content puts it outside the normal document.
                 * The control (the outer container) will collapse in size,
                 * which we don't want to happen -- anything below the control
                 * will suddenly jump in position. To ensure smooth movement,
                 * we force the control and content to match sizes.
                 * 
                 * We first set the content's width to match the container's
                 * width. This may cause the content to change in height.
                 * We then set the container's height to match the content's.
                 */
                this.$PersistentPanel_content().width( this.width() );
                this.height( this.$PersistentPanel_content().outerHeight( true ) );

                var css;
                var viewPortTop = isScrollingParentWindow
                    ? 0
                    : $scrollingParent.offset().top;
                if ( aboveViewPort ) {
                    css = { "top": viewPortTop + "px" };
                } else {
                    var viewPortBottom = isScrollingParentWindow
                        ? 0
                        : viewPortTop + $scrollingParent.height();
                    css = { "bottom": viewPortBottom };
                }
                this.$PersistentPanel_content().css( css );
                
            } else {
                // Reset any dimensions we set while docked.
                this.$PersistentPanel_content().css({
                    "bottom": "",
                    "top": "",
                    "width": ""
                });
                this.css( "height", "" );
            }
            
            this.docked( dock );
        }
    }
    
});

/*
Base class for popups, menus, dialogs, things that appear temporarily over other things.
*/
var Popup = Control.sub({
    className: "Popup",
    inherited: {
        generic: "true"
    }
});
Popup.prototype.extend({
    
    /*
     * True if the user can cancel an open popup by pressing the Escape key.
     * Default is true.
     */
    cancelOnEscapeKey: Control.property.bool( null, true ),
    
    /*
     * True if the popup should be canceled if the user clicks outside it.
     * Default is true. See also the modal() property.
     */
    cancelOnOutsideClick: Control.property.bool( null, true ),
    
    /*
     * True if the popup should be canceled if the window loses focus.
     * Default is true.
     */
    cancelOnWindowBlur: Control.property.bool( null, true ),
    
    /*
     * True if the popup should be canceled if the window changes size.
     * Default is true.
     */
    cancelOnWindowResize: Control.property.bool( null, true ),
    
    /*
     * True if the popup should be canceled if the window is scrolled.
     * Default is true.
     */
    cancelOnWindowScroll: Control.property.bool( null, true ),
    
    /*
     * True if the popup should be closed normally if the user clicks inside
     * it. Default is true.
     */
    closeOnInsideClick: Control.property.bool( null, true ),
    
    /*
     * Cancel the popup. This is just like closing it, but raises a "canceled"
     * event instead.
     * 
     * This has no effect if the popup is already closed.
     */
    cancel: function() {
        return this._close( "canceled" );
    },
    
    /*
     * Close the popup (dismiss it). This raises a "closed" event.
     * 
     * This has no effect if the popup is already closed.
     */
    close: function() {
        return this._close( "closed" );
    },
    
    initialize: function()
    {
        if ( this.overlayClass() === undefined ) {
            this.overlayClass( Overlay );
        }
    },

    /*
     * Open the popup (show it). This raises an "opened" event.
     * 
     * This has no effect if the popup is already opened.
     */
    open: function()
    {
        if ( this.opened() ) {
            // Already opened
            return this;
        }

        var overlayClass = this.overlayClass();
        if ( overlayClass ) {
            var $overlay = overlayClass.create().target( this );
            this._overlay( $overlay );
        }
        
        return this
            ._eventsOn()
            .opened( true )
            .trigger( "opened" )
            // In case popup wants to resize anything now that it's visible.
            .checkForSizeChange()
            // Position the popup after the layout recalc.
            .positionPopup();
    },
    
    /*
     * Open the popup.
     */
    opened: Control.chain( "applyClass/opened" ),
    
    /*
     * The class used to render the overlay behind the popup. The default
     * value is the Overlay class.
     */
    overlayClass: Control.property[ "class" ](),
    
    /*
     * A function called to position the popup when it is opened. By default
     * this has no effect. This can be overridden by subclasses for custom
     * positioning.
     */
    positionPopup: function() {},

    /*
     * Take care of hiding the popup, its overlay, and raising the indicated event.
     */
    _close: function( closeEventName )
    {
        // There may be cases where this function is called more than once.
        // As a defensive measure, we clean things up even if we think we're
        // already closed.
        if ( this._overlay() != null ) {
            this._overlay().remove();
            this._overlay( null );
        }
        this._eventsOff();

        if ( this.opened() ) {
            if ( closeEventName ) {
                this.trigger( closeEventName );
            }
            this.opened( false );
        }
        
        return this;
    },
    
    /*
     * Wire up events.
     */
    _eventsOn: function() {
        
        // Create the handlers as functions we can save in control properties.
        var self = this;
        var handlerDocumentKeydown = function( event ) {
            if ( self.cancelOnEscapeKey() && event.which === 27 /* Escape */ ) {
                // Pressing ESC cancels popup.
                self.cancel();
                event.stopPropagation();
            }
        };
        var handlerDocumentClick = function( event ) {
            var outsideClick = self._isElementOutsideControl( event.target );
            if ( outsideClick && self.cancelOnOutsideClick() ) {
                // User clicked outside popup; implicitly cancel it.
                self.cancel();
            } else if ( !outsideClick && self.closeOnInsideClick() ) {
                // Use click inside popup; implicitly close it.
                self.close();
            }
        };
        var handlerWindowBlur = function( event ) {
            if ( self.cancelOnWindowBlur() ) {
                // Cancel popup when window loses focus.
                self.cancel();
            }
        };
        var handlerWindowResize = function( event ) {
            if ( self.cancelOnWindowResize() ) {
                // Cancel popup when window changes size.
                self.cancel();
            }
        };
        var handlerWindowScroll = function( event ) {
            var outsideScroll = self._isElementOutsideControl( event.target );
            if ( outsideScroll && self.cancelOnWindowScroll() ) {
                // User scrolled outside the popup; implicitly cancel it.
                self.cancel();
            }
        }

        $( document ).on( "keydown", handlerDocumentKeydown );
        $( window ).on({
            blur: handlerWindowBlur,
            resize: handlerWindowResize,
            scroll: handlerWindowScroll
        });
        
        /*
         * Wire up document click handler in a timeout. We do this because a
         * popup is often invoked in response to a click. That triggering
         * click hasn't reached the document yet. If we bound the document click
         * event right now, the triggering click would soon reach the document,
         * immediately triggering cancelation of the popup. The use of a timeout
         * gives the triggering click a chance to bubble all the way up to the
         * document before we wire up the document click handler.
         */
        window.setTimeout( function() {
            // Don't bind event if we managed to get closed during the timeout.
            if ( self.opened() ) {
                $( document ).on( "click", handlerDocumentClick );
            }
        }, 100 );
        
        // Save references to the event handlers so we can unbind them later.
        return this
            ._handlerDocumentClick( handlerDocumentClick )
            ._handlerDocumentKeydown( handlerDocumentKeydown )
            ._handlerWindowBlur( handlerWindowBlur )
            ._handlerWindowResize( handlerWindowResize )
            ._handlerWindowScroll( handlerWindowScroll );
    },
    
    /*
     * Unbind the event handlers we bound earlier.
     */
    _eventsOff: function() {
        
        // Do checks before unbinding in case this function happens to get
        // called more than once.
         
        var handlerDocumentClick = this._handlerDocumentClick();
        if ( handlerDocumentClick ) {
            $( document ).off( "click", handlerDocumentClick );
            this._handlerDocumentClick( null );
        }
        
        var handlerDocumentKeydown = this._handlerDocumentKeydown();
        if ( handlerDocumentKeydown ) {
            $( document ).off( "keydown", handlerDocumentKeydown );
            this._handlerDocumentKeydown( null );
        }
        
        var handlerWindowBlur = this._handlerWindowBlur();
        if ( handlerWindowBlur ) {
            $( window ).off( "blur", handlerWindowBlur );
            this._handlerWindowBlur( null );
        }
        
        var handlerWindowResize = this._handlerWindowResize();
        if ( handlerWindowResize ) {
            $( window ).off( "resize", handlerWindowResize );
            this._handlerWindowResize( null );
        }
        
        var handlerWindowScroll = this._handlerWindowScroll();
        if ( handlerWindowScroll ) {
            $( window ).off( "scroll", handlerWindowScroll );
            this._handlerWindowScroll( null );
        }
        
        return this;
    },
    
    // Handler for the document click event
    _handlerDocumentClick: Control.property(),

    // Handler for the keydown event
    _handlerDocumentKeydown: Control.property(),
    
    // Handler for the window blur event
    _handlerWindowBlur: Control.property(),
    
    // Handler for the window resize event
    _handlerWindowResize: Control.property(),
    
    // Handler for the window scroll event
    _handlerWindowScroll: Control.property(),
    
    /*
     * Return true if the indicated element is outside this control.
     */
    _isElementOutsideControl: function( element ) {
        return ( $( element ).parents().filter( this ).length === 0 );
    },

    // The Overlay control behind the popup absorbing mouse clicks.
    _overlay: Control.property(),

    // Hint for documentation tools.
    _requiresClasses: [ "Overlay" ]

});

/*
A control with a popup.
*/
var PopupSource = Control.sub({
    className: "PopupSource",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "PopupSource_content"
            },
            " ",
            {
                control: "Popup",
                ref: "PopupSource_popup"
            },
            " "
        ]
    }
});
PopupSource.prototype.extend({

    /*
     * Cancels the popup.
     */    
    cancel: Control.chain( "$PopupSource_popup", "cancel" ),

    /*
     * True if the user can cancel an open popup by pressing the Escape key.
     * Default is true.
     */
    cancelOnEscapeKey: Control.chain( "$PopupSource_popup", "cancelOnEscapeKey" ),

    /*
     * True if the popup should be canceled if the user clicks outside it.
     * Default is true.
     */
    cancelOnOutsideClick: Control.chain( "$PopupSource_popup", "cancelOnOutsideClick" ),

    /*
     * True if the popup should be canceled if the window loses focus.
     * Default is true.
     */
    cancelOnWindowBlur: Control.chain( "$PopupSource_popup", "cancelOnWindowBlur" ),

    /*
     * True if the popup should be canceled if the window changes size.
     * Default is true.
     */
    cancelOnWindowResize: Control.chain( "$PopupSource_popup", "cancelOnWindowResize" ),

    /*
     * True if the popup should be canceled if the window is scrolled.
     * Default is true.
     */
    cancelOnWindowScroll: Control.chain( "$PopupSource_popup", "cancelOnWindowScroll" ),
    
    /*
     * Close the popup normally.
     */
    close: Control.chain( "$PopupSource_popup", "close" ),

    /*
     * True if the popup should be closed normally if the user clicks inside
     * it. Default is true.
     */
    closeOnInsideClick: Control.chain( "$PopupSource_popup", "closeOnInsideClick" ),

    /*
     * The element(s) with which the popup will be associated. By default,
     * clicking in the content will open the popup, and the popup will be
     * positioned with respect to this content.
     */
    content: Control.chain( "$PopupSource_content", "content" ),

    /*
     * The class of the content portion.
     */
    contentClass: Control.property[ "class" ]( function( contentClass ) {
        /*
         * If the content element changes (e.g., from a div to a button), we
         * must update our element reference to point to the new element.
         * 
         * TODO: This facility is needed anywhere a control lets the host
         * transmute one of the control's elements, and so should be generalized
         * and moved into the QuickUI runtime.
         */
        var $newContent = this.$PopupSource_content()
                                .transmute( contentClass, true, true, true );
        this.referencedElement( "PopupSource_content", $newContent );
    }),

    initialize: function()
    {
        var self = this;
        this.$PopupSource_content().click( function( event ) {
            if ( self.openOnClick() ) {
                self.open();
            }
        });
        this.$PopupSource_popup()
            .on({
                "closed canceled": function() {
                    self.$PopupSource_popup()
                        .removeClass( "popupAppearsAbove popupAppearsBelow popupAlignLeft popupAlignRight" );
                    self.opened( false );
                },
                opened: function() {
                    self
                        .positionPopup()
                        .opened( true );
                }
            });
    },

    /*
     * True if the popup should open when the user clicks in the control's
     * content. Default is true. 
     */
    openOnClick: Control.property.bool( null, true ),

    /*
     * Open the popup.
     */
    open: Control.chain( "$PopupSource_popup", "open" ),
    
    /*
     * Returns true if the popup is currently opened.
     */
    opened: function( opened ) {
        if ( opened === undefined ) {
            // We mirror the popup's own open state.
            return this.$PopupSource_popup().opened();
        } else {
            // If we're setting this, only set our own state.
            // The popup will have taken care of itself.
            return this.applyClass( "opened", opened );
        }
    },
    
    /*
     * The class used to render the overlay behind the popup.
     */
    overlayClass: Control.chain( "$PopupSource_popup", "overlayClass" ),
    
    /*
     * The content of the popup associated with the control.
     */
    popup: Control.chain( "$PopupSource_popup", "content" ),
    
    /*
     * Position the popup with respect to the content. By default, this will
     * position the popup below the content if the popup will fit on the page,
     * otherwise show the popup above the content. Similarly, align the popup
     * with the content's left edge if the popup will fit on the page,
     * otherwise right-align it.
     * 
     * Subclasses can override this for custom positioning.
     */
    positionPopup: function() {
        
        var offset = this.offset();
        var position = this.position();
        var top = Math.round( offset.top );
        var left = Math.round( offset.left );
        var height = this.outerHeight();
        var width = this.outerWidth();
        var bottom = top + height;
        var right = left + width;
        
        var $popup = this.$PopupSource_popup();
        var popupHeight = $popup.outerHeight( true );
        var popupWidth = $popup.outerWidth( true );

        var scrollTop = $( document ).scrollTop();
        var scrollLeft = $( document ).scrollLeft();
        var windowHeight = $( window ).height();
        var windowWidth = $( window ).width();
        
        var popupCss = {};

        // Vertically position below (preferred) or above the content.
        var popupFitsBelow = ( bottom + popupHeight <= windowHeight + scrollTop );
        var popupFitsAbove = ( top - popupHeight >= scrollTop );
        var popupAppearsBelow = ( popupFitsBelow || !popupFitsAbove );
        popupCss.top = ( popupAppearsBelow )
            ? ""                                            // Use default top
            : popupCss.top = position.top - popupHeight;    // Show above content
        
        // Horizontally left (preferred) or right align w.r.t. content.
        var popupFitsLeftAligned = ( left + popupWidth <= windowWidth + scrollLeft );
        var popupFitsRightAligned = ( right - popupWidth >= scrollLeft );
        var popupAlignLeft = ( popupFitsLeftAligned || !popupFitsRightAligned );
        popupCss.left = ( popupAlignLeft )
            ? ""                                                    // Use default left
            : popupCss.left = position.left + width - popupWidth;   // Right align

        $popup
            .toggleClass( "popupAppearsAbove", !popupAppearsBelow )
            .toggleClass( "popupAppearsBelow", popupAppearsBelow )
            .toggleClass( "popupAlignLeft", popupAlignLeft )
            .toggleClass( "popupAlignRight", !popupAlignLeft )
            .css( popupCss );
        
        return this;
    }
});

/*
A labeled radio button.
*/
var RadioButton = LabeledInput.sub({
    className: "RadioButton",
    inherited: {
        _type: "radio"
    }
});
RadioButton.prototype.extend({
    
    /*
     * True if the control should automatically select a name() property value
     * if no name is specified. This automatic name will match the name of other
     * autonamed sibling radio buttons, allowing them to work as a radio button
     * group without the need for an explicit name.
     */
    autoName: Control.property.bool( null, true, function() {
        this._checkName();
    }),
    
    initialize: function() {
        this.inDocument( function() {
            this._checkName();
        });
    },
    
    /*
     * The text name of the radio button group.
     * 
     * You can set the name() of all radio buttons in the same group to the same
     * value to ensure the radio buttons are mutually exclusive. Alternatively,
     * you can rely on the autoName() property to automatically select a name
     * which will group the control with auto-named sibiling radio buttons.
     */
    name: Control.chain( "_inputControl", "prop/name", function() {
        this._checkName();
    }),
    
    _checkName: function() {
        if ( this.inDocument() && this.autoName() && !this.name() ) {
            /*
             * Pick a name.
             * First look for an autonamed sibling.
             */
            var named;
            this.siblings().eachControl( function( index, control ) {
                if ( control instanceof RadioButton
                    && control.autoName()
                    && control.name() ) {
                    named = control;
                    return false;
                }
            });
            var name = named
                ? named.name()  /* Use sibling's name. */
                : RadioButton.generateUniqueName(); /* Generate a name. */
            this.name( name );
        }
    }
});

/* Class members */
RadioButton.extend({
    
    generateUniqueName: function() {
        return "_group" + this._count++;
    },
    
    _count: 0
    
});

/* Creates a certain number of instances of another control class. */
var Repeater = Control.sub({
    className: "Repeater"
});
Repeater.prototype.extend({

    /*
     * The content which will be repeated in each instance.
     */
    content: Control.property( function( content ) {
        this._refreshContent( this.controls() );
    }),
    
    /*
     * The generated collection of controls.
     */
    controls: Control.chain( "children", "control" ),
    
    /*
     * The number of repetitions to create.
     * The default count is 1.
     */
    count: Control.property.integer( function() { this._refresh(); }, 1 ),
    
    initialize: function() {
        if ( this.controls() == null ) {
            this._refresh();
        }
    },
    
    /*
     * True if the Repeater should append "1", "2", "3", etc., after the
     * content of each instance.
     */
    increment: Control.property.bool( function() {
        this._refreshContent( this.controls() );
    }),

    /*
     * The class that will be repeated.
     */
    repeatClass: Control.property[ "class" ]( function() { this._refresh(); }),

    _refresh: function() {
        var repeatClass = this.repeatClass();
        var count = this.count();
        if ( repeatClass && count > 0 ) {
            var controls = [];
            for ( var i = 0; i < count; i++ ) {
                var $control = repeatClass.create();
                controls.push( $control );
            }
            this._refreshContent( controls );
        }
        // Use base .content() property since we've overridden it.
        Control( this ).content( controls );
    },
    
    _refreshContent: function( controls ) {
        if ( controls == null ) {
            return;
        }
        var content = this.content();
        var increment = this.increment();
        for ( var i = 0; i < controls.length; i++ ) {
            var $control = $( controls[i] ).control();
            // TODO: if content is jQuery object, should clone elements. 
            var instanceContent;
            if ( content && increment ) {
                instanceContent = content + " " + ( i + 1 );
            } else if ( content ) {
                instanceContent = content;
            } else if ( increment ) {
                instanceContent = i + 1;
            }
            if ( instanceContent ) {
                $control.content( instanceContent );
            }
        }
    }
    
});

var SearchBox = Control.sub({
    className: "SearchBox",
    inherited: {
        content: [
            " ",
            {
                control: "HintTextBox",
                ref: "SearchBox_content",
                hint: "Search"
            },
            " ",
            {
                control: "BasicButton",
                ref: "searchButton",
                content: [
                    " ",
                    {
                        html: "<img src=\"http://quickui.org/release/resources/search_16x16.png\" />",
                        ref: "searchIcon"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "true"
    }
});
SearchBox.prototype.extend({

    /*
     * The content of the text box.
     */    
    content: function(value) {
        result = this.$SearchBox_content().content(value); 
        if (value !== undefined) 
        {
            this._disableButtonIfContentEmpty();
        }
        return result;
    },
    
    /*
     * A hint to show in the text box.
     */    
    hint: Control.chain( "$SearchBox_content", "hint" ),

    initialize: function() {
        
        if ( !this.query() ) {
            var hostname = window.location.hostname;
            this.query( "http://www.google.com/search?q=%s+site%3A" + hostname );
        }
        
        var self = this;
        this.$searchButton().on( "click", function() {
            self.search();
        });
        this.$SearchBox_content().on({
            "change keyup": function( event ) {
                self._disableButtonIfContentEmpty();
            },
            keydown: function( event ) {
                if ( !self._isContentEmpty() ) {
                    switch ( event.which ) {
                        
                        case 13: /* Enter */
                            self.search();
                            event.stopPropagation();
                            break;
                            
                        case 27: /* Escape */
                            self.content( null );
                            event.stopPropagation();
                            break;
                        
                    }
                }
            } 
        });

        this._disableButtonIfContentEmpty();
    },
    
    /*
     * The search query that should be executed when the user presses the "Go"
     * button. This should be string containing the sequence "%s", which will
     * be replaced with the search terms the user has entered in the text box.
     * The default value of this property will use Google to search the
     * current site.
     */
    query: Control.property(),
    
    /*
     * Initiate the search. If the query is undefined or null, this has no
     * effect.
     */
    search: Control.iterator( function() {
        var query = this.query();
        if ( query ) {
            var searchTerms = this.content();
            var url = query.replace( "%s", searchTerms );
            window.location.href = url;
        }
    }),

    _disableButtonIfContentEmpty: function() {
        this.$searchButton().disabled( this._isContentEmpty() );
    },

    _isContentEmpty: function() {
        var content = this.content();
        return !( content && content.length > 0 );
    }

});

/*
An ordered sequence of elements which can be navigated through one at a time.
*/
var Sequence = Control.sub({
    className: "Sequence",
    inherited: {
        generic: "true"
    }
});
Sequence.prototype.extend({
    
    /*
     * The currently visible element. The getter returns the element as an
     * instance of the appropriate control class.
     */
    activeElement: Control.iterator( function( activeElement ) {
        if ( activeElement === undefined ) {
            return this.elements().filter( ".active" ).eq(0).cast( jQuery );
        } else {
            
            /*
             * Apply a "inactive" style instead of just forcing display to none.
             * If we did that, we would have no good way to undo the hiding.
             * A simple .toggle(true) would set display: block, which wouldn't
             * be what we'd want for inline elements.
             */
            this.elements().not( activeElement )
                .addClass( "inactive" )
                .removeClass( "active" );

            var index = this.elements().index( activeElement );

            // Tell the child it's now active, and show it.
            $( activeElement )
                .trigger( "active" )
                .removeClass( "inactive" )
                .addClass( "active" );
            
            this
                // Trigger our own activeElementChanged event.
                .trigger( "activeElementChanged", [ index, activeElement ] )
            
                // In case the new child changed our size.
                .checkForSizeChange();
            
            return this;
        }
    }),
    
    /*
     * The index of the currently visible element.
     */
    activeIndex: function( index ) {
        if ( index === undefined ) {
            return this.elements().index( this.activeElement() );
        } else {
            return this.activeElement( this.elements().eq( index ) );
        }
    },
    
    /*
     * The array of elements in the sequence; only one will be shown at a time.
     * 
     * If the set changes, this will attempt to preserve the one that was
     * previously active. Otherwise, the first element is made active.
     */
    content: function( content ) {
        var container = this._container();
        if ( content === undefined ) {
            return ( this[0] === container[0] )
                ? this._super( content )
                : container.content( content );

        } else {
        
            // Save active element before setting content.
            var previousControl = this.activeElement();

            var result = ( this[0] === container[0] )
                ? this._super( content )
                : container.content( content );
        
            if ( previousControl && previousControl.parent()[0] === this[0] ) {
                // Still have previously active child; hide other elements.
                this.activeElement( previousControl );
            } else {
                this.activeIndex( 0 );
            }

            return result;
        }
    },

    /*
     * The set of elements in the sequence.
     */
    elements: Control.chain( "_container", "children", "cast" ),
    
    initialize: function() {
        if ( this.elements().length > 0 && this.activeIndex() < 0 ) {
            // Show first child by default. 
            this.activeIndex(0);
        }
    },

    /*
     * Show the next child. If the last child is currently shown, this has no
     * effect.
     */
    next: Control.iterator( function() {
        var index = this.activeIndex();
        if ( index < this.elements().length - 1 ) {
            this.activeIndex( index + 1 );
        }
    }),

    /*
     * Show the previous child. If the first child is currently shown, this has
     * no effect.
     */
    previous: Control.iterator( function() {
        var index = this.activeIndex();
        if ( index > 0 ) {
            this.activeIndex( index - 1 );
        }
    }),

    _container: function() {
        return this;
    }

});

/*
A polyconstrainHeight (shim) supporting the CSS flexible box layout model on newer browsers
and emulating some very basic aspects of that layout model on older browsers.

As of 3/12/12, Mozilla's flexbox support is too flaky to use. Among other
things, if the CSS position is set to absolute, Mozilla will report "display"
as "block" instead of "-moz-box" as expected, which makes it hard to tell
whether flexbox is even supported. Forcing the use of flexbox reveals more
bugs; it's just not worth using at this point.
*/
var SimpleFlexBox = Control.sub({
    className: "SimpleFlexBox",
    inherited: {
        content: [
            " ",
            {
                html: "<div class=\"panel\" />",
                ref: "SimpleFlexBox_panel1"
            },
            " ",
            {
                html: "<div />",
                ref: "SimpleFlexBox_content"
            },
            " ",
            {
                html: "<div class=\"panel\" />",
                ref: "SimpleFlexBox_panel2"
            },
            " "
        ]
    }
});
SimpleFlexBox.prototype.extend({
    
    /*
     * The content of the main center panel.
     */
    content: Control.chain( "$SimpleFlexBox_content", "content" ),

    /*
     * Set this to true if you have styled the control to constrain its
     * height, e.g., with absolute positioning or a hard pixel height. 
     * (Unfortunately, there doesn't seem to be a way to programmatically
     * determine whether the control has had its height styled.) The default
     * is false.
     */
    constrainHeight: Control.chain( "applyClass/constrainHeight", function() {
        if ( !this._checkFlexBox() ) {
            this.trigger( "layout" );
        }
    }),
    
    initialize: function() {
        this.inDocument( function() {
            this._checkFlexBox();
        });
    },
    
    /*
     * The orientation of the panels: "horizontal" or "vertical".
     */
    orient: Control.property( function( orient ) {
        var vertical = this._vertical();
        this.toggleClass( "horizontal", !vertical );
        this.toggleClass( "vertical", vertical );
        this._checkFlexBox();
    }, "horizontal"),
    
    /*
     * See if we can use the CSS flexible layout module (preferred), whether
     * we can use other flexbox-less styling for layout, or whether we need to
     * do manual layout. For the latter, start a layout event handler.
     * Return true if we're using flexbox, false if not.  
     */
    _checkFlexBox: function() {
        
        if ( !this.inDocument() ) {
            /*
             * Detection of flexbox support requires styles, which means the
             * control has to be in the DOM.
             */
             return false;
        }

        var flexBox = SimpleFlexBox.usingFlexBox( this );
        var constrainHeight = this.constrainHeight();
        
        /*
         * WebKit has a bug preventing use of overflow: auto in combination with
         * -webkit-box-orient: horizontal, which will often come up when
         * constraining height.
         * See http://code.google.com/p/chromium/issues/detail?id=118004.
         * Until that gets fixed, we disable flexbox support on WebKit for
         * horizontal orientation and constrained height.
         */
        if ( $.browser.webkit && !this._vertical() && constrainHeight ) {
            flexBox = false;
        }

        /*
         * We have to set the noFlexBox class before the layout event handler
         * gets bound; binding forces an initial layout handler call, which will
         * need the noFlexBox class to be applied in order to calculate the
         * layout properly.
         */
        this._usingFlexBox( flexBox );
        this._childrenCheckSize();
        
        // Handle the layout events as needed.
        var handlingLayout = this._handlingLayout();
        var needLayout = !flexBox && constrainHeight;
        if ( needLayout && !handlingLayout ) {
            var self = this;
            this.on( "layout sizeChanged", function() {
                self._layout();
            });
            this._handlingLayout( true );
        } else if ( !needLayout && handlingLayout ) {
            this.off( "layout sizeChanged" );
            this._handlingLayout( false );
        }
        
        return flexBox;
    },
    
    /*
     * Simulate flex behavior for the main content panel when the height
     * is constrained.
     */
    _layout: function() {

        var vertical = this._vertical();
        var measureFn = vertical ? $.prototype.outerHeight : $.prototype.outerWidth;
        var sizePanel1 = measureFn.call( this.$SimpleFlexBox_panel1(), true );
        var sizePanel2 = measureFn.call( this.$SimpleFlexBox_panel2(), true );
        var css = vertical
            ? {
                bottom: sizePanel2, 
                top: sizePanel1
            }
            : {
                left: sizePanel1,
                right: sizePanel2
            };
        this.$SimpleFlexBox_content().css( css );

        this._childrenCheckSize();
    },

    /*
     * If the layout of the control changes in any way, the subcontrols
     * contained in the panels should check to see if they've changed size.
     */
    _childrenCheckSize: function() {
        var $controls = this.children().children().control();
        if ( $controls != null ) {
            $controls.checkForSizeChange();
        }
    },
    
    /*
     * True if we're currently handling the layout event to do manual layout.
     */
    _handlingLayout: Control.property.bool( null, false ),
    
    /*
     * The content of the first docked panel.
     */    
    _panel1: Control.chain( "$SimpleFlexBox_panel1", "content", function() {
        if ( !this._usingFlexBox() ) {
            this.$SimpleFlexBox_panel1().checkForSizeChange();
        }
    }),
    
    /*
     * The content of the second docked.
     */
    _panel2: Control.chain( "$SimpleFlexBox_panel2", "content", function() {
        if ( !this._usingFlexBox() ) {
            this.$SimpleFlexBox_panel2().checkForSizeChange();
        }
    }),

    /*
     * True if the control is currently using CSS flexible box layout, and
     * false if using manual layout.
     */
    _usingFlexBox: function( usingFlexBox ) {
        if ( usingFlexBox === undefined ) {
            return !this.hasClass( "noFlexBox" );
        } else {
            return this.toggleClass( "noFlexBox", !usingFlexBox );
        }
    },
    
    // Return true if we're using vertical orientation, false if not.
    _vertical: function() {
        return ( this.orient() === "vertical" );
    }
    
});

/* Class methods */
SimpleFlexBox.extend({

    /*
     * Returns true if the given element is using the CSS flexible layout module.
     */
    usingFlexBox: function( $element ) {
        var flexBoxVariants = [
            "box",
            /* "-moz-box", */
            "-webkit-box"
        ];
        return $.inArray( $element.css( "display" ), flexBoxVariants ) >= 0;
    }

});

/*
Display children as elements on a sliding horizontal strip; only one element
is visible at a time. The strip can be programmatically slid left and right.
*/
var SlidingPanels = Sequence.sub({
    className: "SlidingPanels",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "SlidingPanels_content"
            },
            " "
        ]
    }
});
SlidingPanels.prototype.extend({
    
    /*
     * The index of the control currently being shown.
     */
    activeIndex: function( activeIndex ) {
        var result = this._super( activeIndex );
        if ( activeIndex !== undefined ) {
            var panel = this.elements().eq( activeIndex );
            if ( panel.length > 0 ) {
                var left = panel.position().left;
                if ( SlidingPanels.hasTransitions( this.$SlidingPanels_content() ) ) {
                    // Use CSS animation.
                    this.$SlidingPanels_content().css( "left", -left );
                }
                else {
                    // Fall back to jQuery animation.
                    this.$SlidingPanels_content().animate({
                        "left": -left
                    }, "fast" );
                }
            }            
        }
        return result;
    },

    /*
     * The array of elements in the sequence; only one will be shown at a time.
     * 
     * If the set changes, this will attempt to preserve the one that was
     * previously active. Otherwise, the first element is made active.
     */
    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined ) {
            this._adjustWidths();
        }
        return result;
    },
    
    initialize: function() {
        var self = this;
        this
            .inDocument( function() {
                this._adjustWidths();
            })
            .on( "layout sizeChanged", function() {
                self._adjustWidths();
            });
    },
    
    // Force all elements and the control itself to the maximium width of the elements.
    _adjustWidths: function() {

        var elements = this.elements();
        if ( elements.length === 0 ) {
            return;
        }
        
        var panelWidths = elements.map( function( index, panel ) {
            return $( panel ).width();
        }).get();
        var maxpanelWidth = Math.max.apply( this, panelWidths );
        if ( maxpanelWidth > 0 ) {
            elements.width( maxpanelWidth );
        }

        var panelOuterWidths = elements.map( function( index, panel ) {
            return $( panel ).outerWidth( true );
        }).get();
        var maxpanelOuterWidth = Math.max.apply( this, panelOuterWidths );
        if ( maxpanelOuterWidth > 0 ) {
            this.width( maxpanelOuterWidth );
        }
    },

    _container: Control.chain( "$SlidingPanels_content" )
    
});

/*
 * Class methods
 */
SlidingPanels.extend({

    /*
     * Returns true if the given element has CSS transitions applied to it.
     */
    hasTransitions: function( $element ) {
        transitionProperties = [
            "-webkit-transition",
            "transition"
        ];
        // HACK for IE8, in which jQuery 1.7.2 will throw an exception if we
        // try to get the css("transition") property.
        if ( $.browser.msie && parseInt( $.browser.version ) < 9 ) {
            return false;
        }
        for ( var i = 0; i < transitionProperties.length; i++ ) {
            var value = $element.css( transitionProperties[i] );
            if ( value !== undefined && value !== "" ) {
                return true;
            }
        }
        return false;
    }

})

/*
Show its children as sliding pages which can be navigated by clicking buttons below.
(The conventional button representation is a dot.)
*/
var SlidingPanelsWithDots = Control.sub({
    className: "SlidingPanelsWithDots",
    inherited: {
        content: [
            " ",
            {
                control: "SlidingPanels",
                ref: "pages"
            },
            " ",
            {
                html: "<div />",
                ref: "buttonPanel",
                content: [
                    " ",
                    {
                        control: "Repeater",
                        ref: "pageButtons"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "true"
    }
});
SlidingPanelsWithDots.prototype.extend({
    
    /*
     * The index of the page currently being shown.
     */
    activeIndex: Control.property( function( activeIndex ) {
        this.$pages().activeIndex( activeIndex );
        this.pageButtons()
            .removeClass( "selected" )
            .eq( activeIndex )
                .addClass( "selected" );
        return this;
    }),
    
    /*
     * The set of elements to show as pages.
     */
    content: Control.chain( "$pages", "content", function() {
        this.$pageButtons().count( this.elements().length );
    }),
    
    elements: Control.chain( "$pages", "elements" ),
    
    initialize: function() {
        
        if ( !this.pageButtonClass() ) {
            this.pageButtonClass( BasicButton );
        }

        var self = this;
        this.$pageButtons().click( function( event ) {
            // Which button was clicked?
            var pageButton = $( event.target ).closest( self.pageButtons() ).control();
            if ( pageButton ) {
                var index = self.pageButtons().index( pageButton );
                if ( index >= 0 ) {
                    self.activeIndex( index );
                }
            }
        });
        
        if ( !this.activeIndex() ) {
            this.activeIndex(0);
        }
    },
    
    pageButtons: Control.chain( "$pageButtons", "children" ),

    /*
     * The class used to render the buttons to navigate between pages.
     */    
    pageButtonClass: Control.chain( "$pageButtons", "repeatClass" )

});

/*
Very basic CSS image sprite.
The images have to be stacked vertically, and all be the same height.
*/
var Sprite = Control.sub({
    className: "Sprite"
});
Sprite.prototype.extend({
    
    /*
     * The sprite image.
     */
    image: Control.chain( "css/background-image" ),

    /*
     * The height of a single cell in the sprite image, in pixels.
     */
    cellHeight: Control.property( function( value ) {
        this.css( "height", value + "px" );
        this._shiftBackground();
    }),
    
    /*
     * The sprite cell currently shown.
     */
    currentCell: Control.property( function( value ) {
        this._shiftBackground();
    }, 0),

    _shiftBackground: Control.iterator( function() {
        if ( this.currentCell() != null && this.cellHeight() != null ) {
            var y = ( this.currentCell() * -this.cellHeight() ) + "px";
            if ( $.browser.mozilla ) {
                // Firefox 3.5.x doesn't support background-position-y,
                // use background-position instead.
                var backgroundPosition = this.css( "background-position" ).split(" ");
                backgroundPosition[1] = y;
                this.css( "background-position", backgroundPosition.join(" ") );          
            } else {
                // Not Firefox
                this.css( "background-position-y", y );
            }
        }
    })
});

/* A button that uses CSS image sprites for its background. */
var SpriteButton = BasicButton.sub({
    className: "SpriteButton",
    inherited: {
        content: [
            " ",
            {
                control: "Sprite",
                ref: "backgroundLeft"
            },
            " ",
            {
                control: "Sprite",
                ref: "backgroundRight"
            },
            " ",
            {
                html: "<div />",
                ref: "SpriteButton_content"
            },
            " "
        ],
        generic: "false"
    }
});
SpriteButton.prototype.extend({

    /*
     * The height of the sprite image, in pixels.
     */    
    cellHeight: Control.chain( "css/height", function( value ) {
        this._sprites().cellHeight( value );
    }),
    
    content: Control.chain( "$SpriteButton_content", "content" ),
    
    /*
     * The sprite image.
     */
    image: Control.chain( "_sprites", "image" ),
    
    _renderButtonState: function( buttonState ) {
        this._sprites().currentCell( buttonState );
    },
    
    _sprites: Control.chain( "children", "filter/.Sprite", "cast" )

});

/* A control that can be used as a tab in a Tabs. */
var Tab = Control.sub({
    className: "Tab"
});
Tab.prototype.extend({
    
    /*
     * The content of the tab.
     */
    content: function( value ) {
        var result = this._super( value );
        if ( value !== undefined ) {
            // The parent (e.g., a Tabs) may want to know that the size
            // of this element has changed.
            this.checkForSizeChange();  
        }
        return result;
    },
    
    /*
     * The description which should be rendered in the button for the tab.
     */
    description: Control.property()
    
});

/*
A set of tabbed pages.

Each child of the content will be treated as a page. If the child has a function
called description(), that will be used as the name on the tab.

The Tabs control will resize itself to be as tall as its tallest child.
*/
var Tabs = Control.sub({
    className: "Tabs",
    inherited: {
        content: [
            " ",
            {
                control: "VerticalPanels",
                ref: "tabPanels",
                top: [
                    " ",
                    {
                        control: "List",
                        ref: "tabButtons",
                        itemClass: "BasicButton"
                    },
                    " "
                ],
                content: [
                    " ",
                    " ",
                    {
                        control: "Modes",
                        ref: "Tabs_content",
                        maximize: "true"
                    },
                    " "
                ]
            },
            " "
        ],
        generic: "true"
    }
});
Tabs.prototype.extend({
    
    /*
     * The array of elements to be shown as tabs.
     */
    content: Control.chain( "$Tabs_content", "content", function() {
        this._createButtons();
    }),

    /*
     * The class used to render the container for the tabbed pages.
     */
    contentClass: function( contentClass ) {
        if ( contentClass === undefined ) {
            return this.$Tabs_content().controlClass();
        } else {
            // The default Modes class sets the content's size, so clear any
            // explicitly-set height and width.
            this.$Tabs_content().css({
                height: "",
                width: ""
            });
            var $new = this.$Tabs_content().transmute( contentClass, true );
            this.referencedElement( "Tabs_content", $new );
            return this;
        }
    },

    /*
     * True if the Tabs should vertically fill its container.
     */    
    fill: Control.chain( "$tabPanels", "fill" ),
    
    initialize: function() {

        var self = this;
        this.$tabButtons().click( function( event ) {
            var tabButtonCssClass = "." + self.tabButtonClass().prototype.className;
            var tabButton = $( event.target ).closest( tabButtonCssClass ).control();
            if ( tabButton ) {
                var index = self.tabButtons().index( tabButton );
                if ( index >= 0 ) {
                    var tab = self.tabs()[ index ];
                    self.trigger( "tabButtonClick", [ index, tab ]);
                    if ( self.selectTabOnClick() ) {
                        self.selectedTabIndex( index );
                    }
                }
            }
        });
        
        this.$Tabs_content().on({
            "activeElementChanged": function( event, index, child ) {
                /*
                 * Map the Modes's activeElementChanged event to a more
                 * semantically specific activeTabChanged event.
                 * 
                 * Only map active events coming from our own Modes; ignore
                 * events coming from any Modes within a tab.
                 */
                var tab = $( event.target ).filter( self.tabs() );
                if ( tab.length > 0 ) {
                    event.stopPropagation();
                    self.trigger( "activeTabChanged", [ index, child ] );
                }
            }
        });
        
        if ( this.tabs().length > 0 && !this.selectedTabIndex() ) {
            // Select first tab by default.
            this.selectedTabIndex(0);
        }
    },
    
    /*
     * True if a tab should be selected on click; false if the showing of the
     * clicked tab will be handled separately. 
     */
    selectTabOnClick: Control.property.bool( null, true ),

    /*
     * The child currently shown as the selected tab.
     */
    selectedTab: Control.chain( "$Tabs_content", "activeElement" ),
    
    /*
     * The index of the selected tab.
     */
    selectedTabIndex: Control.chain( "$Tabs_content", "activeIndex", function( index ) {
        this.tabButtons()
            .removeClass( "selected" )    // Deselect all tab buttons.
            .eq( index )
            .addClass( "selected" );      // Select the indicated button.
    }),

    /*
     * The current set of tab button controls.
     */
    tabButtons: Control.chain( "$tabButtons", "children" ),
    
    /*
     * The class which should be used to create tab buttons for the set.
     */
    tabButtonClass: Control.chain( "$tabButtons", "itemClass", function() {
        this._createButtons();
    }),
    
    /*
     * The content of the current set of tabs.
     */
    tabs: Control.chain( "$Tabs_content", "elements" ),

    /*
     * Called whenever the set of buttons needs to be regenerated.
     */
    _createButtons: function() {
        
        if ( this.tabButtonClass() === undefined ) {
            return;
        }
        
        // Show the description for each tab as a button.
        var descriptions = this.tabs()
            .map( function( index, tab ) {
                var $tab = $( tab ).control();
                var description = ( $tab && $.isFunction( $tab.description ) )
                        ? $tab.description()
                        : "";
                return description;
            })
            .get();
            
        this.$tabButtons().items( descriptions );
        
        var selectedTabIndex = this.selectedTabIndex(); 
        if ( selectedTabIndex != null ) {
            // Ensure the indicated button is shown as selected.
            this.selectedTabIndex( selectedTabIndex );
        }
    }

});

/*
General purpose base class for text box controls.

This simply wraps a normal input element.
*/
var TextBox = Control.sub({
    className: "TextBox",
    tag: "input"
});
TextBox.prototype.extend({
    
    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined ) {
            /*
             * Setting content programmatically generates a change event
             * so that the UI can react accordingly.
             */
            this.trigger( "change" );
        }
        return result;
    },
    
    initialize: function() {
        this.prop( "type", "text" );
    },

    /*
     * The placeholder (hint text) shown in the text box if it's empty.
     */
    placeholder: Control.chain( "prop/placeholder" )
    
});

/*
Control with a content area (usually some form of text box) and an associated "Go" button
(labeled something like "Search"), where clicking the button does something with the content.
*/
var TextBoxWithButton = Control.sub({
    className: "TextBoxWithButton",
    inherited: {
        content: [
            " ",
            {
                html: "<div />",
                ref: "TextBoxWithButton_textBox"
            },
            " ",
            {
                html: "<div />",
                ref: "TextBoxWithButton_goButton"
            },
            " "
        ]
    }
});
TextBoxWithButton.prototype.extend({
    
    /*
     * The button shown next to the text box. This button is disabled if the
     * text box is currently empty.
     */
    goButton: Control.chain("$TextBoxWithButton_goButton", "content"),
    
    initialize: function() {
        var self = this;
        this.$TextBoxWithButton_textBox().on("change keydown keyup", function(event) {
            self._disableButtonIfContentEmpty();
            var keyCode = event.keyCode || event.which;
            if (!self._isContentEmpty() && keyCode == 13 /* Enter */)
            {
                self.trigger("goButtonClick");
            }
        });
        this.$TextBoxWithButton_goButton().click(function() {
            self.trigger("goButtonClick");
        });
        this._disableButtonIfContentEmpty();
    },

    /*
     * The content of the text box.
     */    
    content: function(value) {
        result = this.$TextBoxWithButton_textBox().content(value); 
        if (value !== undefined) 
        {
            this._disableButtonIfContentEmpty();
        }
        return result;
    },
    
    /*
     * The text box.
     */    
    textBox: Control.chain("$TextBoxWithButton_textBox", "content"),
    
    _disableButtonIfContentEmpty: function() {
        var content = this.content();
        var $goButton = this.$TextBoxWithButton_goButton();
        if ($goButton.children().length > 0)
        {
            var buttonControl = Control($goButton.children()[0]);
            if (buttonControl != null && buttonControl instanceof BasicButton)
            {
                buttonControl.disabled(this._isContentEmpty());
            }
        }
    },
    
    _isContentEmpty: function() {
        var content = this.content();
        return !(content && content.length > 0);
    }
    
});

/*
Shows text in a condensed font if necessary to squeeze in more text.
*/
var TextCondenser = Control.sub({
    className: "TextCondenser",
    inherited: {
        content: [
            " ",
            /* Flip between two copies of text text: one normal, one condensed. */
            " ",
            {
                html: "<span />",
                ref: "normal"
            },
            " ",
            {
                html: "<span />",
                ref: "condensed"
            },
            " "
        ]
    }
});
TextCondenser.prototype.extend({
    
    /*
     * The font family to use for condensed text.
     */
    condensedFontFamily: Control.chain( "$condensed", "css/font-family" ),

    content: Control.chain( "$normal", "content", function( content ) {
        this.$condensed().content( content ); // Make a copy of the text.
        this.checkForSizeChange();
    }),
    
    initialize: function() {
        var self = this;
        this.on( "layout sizeChanged", function() {
            self.layout();
        });
    },
    
    layout: function() {
        return this.eachControl( function( index, $control ) {
            var tooWide = this.$normal().width() > this.width();
            this.applyClass( "condensed", tooWide );
        });
    }
});

/* A button which can hold a selected state. */
var ToggleButton = BasicButton.sub({
    className: "ToggleButton",
    inherited: {
    }
});
ToggleButton.prototype.extend({
    
    initialize: function() {
        var self = this;
        this.click( function() {
            if ( !self.disabled() ) {
                self.toggleSelected();
            }
        });
    },

    /*
     * True if the button is currently in the selected state.
     */    
    selected: Control.chain( "applyClass/selected" ),

    /*
     * Toggle the button's selected state.
     */    
    toggleSelected: function( value ) {
        this.selected( value || !this.selected() );
    }
});

/*
A message which briefly appears on a page before automatically disappearing. 
*/
var TransientMessage = Control.sub({
    className: "TransientMessage",
    inherited: {
        generic: "true"
    }
});
TransientMessage.prototype.extend({

    /*
     * Close display of the message normally.
     */
    close: function() {
        var self = this;
        this.fadeOut( null, function() {
            self._close();
        });
        return this;
    },
    
    /*
     * The time before the message begins to fade out.
     * 
     * If undefined (the default value), the duration will be calculated from
     * the length of the message. If negative, the message will not
     * automatically be closed, but can be closed by invoking close().
     */
    duration: Control.property(),
    
    initialize: function() {
        var self = this;
        this.click( function() {
            self._close();
        });
    },

    /*
     * Show the message.
     */    
    open: function() {
        
        var duration = this.duration();
        if ( !duration ) {
            var content = this.content();
            var length = ( typeof content === "string" )
                ? content.length
                : $( content ).text().length;
            duration = 750 + ( length * 20 );
        }
        
        if ( duration >= 0 ) {
            var self = this;
            var timeout = setTimeout( function() {
                self.close();
            }, duration );
            this._timeout( timeout );
        }
        
        this
            .positionMessage()
            .fadeIn(); // TODO: Investigate why this doesn't actually fade in.
        
        return this;
    },
    
    /*
     * Position the message. By default, this is center-aligned at the top
     * of the page.
     */
    positionMessage: function() {
        return this.css({
            left: ( $( window ).width() - this.outerWidth() ) / 2
        });
    },

    _close: function() {
        var timeout = this._timeout();
        if ( timeout) {
            clearTimeout( timeout );
            this._timeout( null );
        }
        this.remove();
    },
    
    _timeout: Control.property()
    
});

/* Class methods */
TransientMessage.extend({
    
    /*
     * Show the given content for the indicated (optional) duration.
     */
    showMessage: function( content, duration ) {
        
        var transientMessage = TransientMessage.create();
        if ( content ) {
            transientMessage.content( content );
        }
        if ( duration ) {
            transientMessage.duration( duration );
        }
        
        $( document.body )
            .append( transientMessage );
        transientMessage.open();
        
        return transientMessage;
    },
    
});

/*
Validates textual input using an asymmetric validation scheme.
This applies a validation function while the user is typing, when the
control loses focus, or when a validate() method is called.

The validation is considered asymmetric because the control behaves differently
in an error state than when not in an error state:
1. If the control is not yet in an error state, the control's validity is not
reflected until the focus leaves the control. That is, the input is assumed
to be good until the user has moved on.
2. If the control is already in an error state, the control's validity is
reflected immediately upon detecting valid input. That is, the error is
forgiven without requiring that the user moves the focus away.

For more discussion: http://miksovsky.blogs.com/flowstate/2010/09/index.html.
*/
var ValidatingTextBox = TextBox.sub({
    className: "ValidatingTextBox",
    inherited: {
        generic: "true"
    }
});
ValidatingTextBox.prototype.extend({
    
    /*
     * The control's content. Setting this implicitly performs validation.
     */
    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined && this.validateOnSet() ) {
            this.validate( true );
        }
        return result;
    },
    
    initialize: function() {
        var self = this;
        this.on({
            "blur": function() {
                if ( self.validateOnBlur() ) {
                    self.validate( true );
                }
            },
            "keyup": function() {
                self.validate();
            }
        });
    },
    
    invalid: Control.chain( "applyClass/invalid" ),
    
    /*
     * True if the text box must be non-empty to be valid.
     */
    required: Control.property.bool(),
    
    /*
     * Returns true if the control's contents are valid.
     * The default implementation simply looks as the required() property and,
     * if true, ensures the content is non-empty.
     *  
     * Subclasses can override this to validate their contents. E.g.:
     * 
     *      valid: function() {
     *          var valid = this._super();
     *          valid = valid && ... Perform additional checks here ...
     *          return valid;
     *      }
     */
    valid: function() {
        var valid;
        if ( this.required() )
        {
            var content = this.content();
            valid = !!content && content.length > 0;
        } else {
            valid = true;
        }
        return valid;
    },
    
    /*
     * Check to see if the control's contents are valid.
     * 
     * If the strict parameter is true, apply the invalid state if the contents
     * are invalid. If the strict parameter is false, then the control can move
     * out of the invalid state (if the contents are now valid), but won't move
     * into the invalid state (even if the contents are actually invalid).
     */
    validate: Control.iterator( function( strict ) {
        var valid = this.valid();
        if ( strict || this.invalid() ) {
            this.invalid( !valid );
        }
    }),
    
    /*
     * True if validation should be automatically be performed when the control
     * loses focus. Default is true.
     */
    validateOnBlur: Control.property.bool( null, true ),

    /*
     * True if validation should be automatically be performed when the control's
     * content is set programmatically. Default is true.
     */
    validateOnSet: Control.property.bool( null, true )

});

/* Position a top and/or bottom panel above or below a main content panel. */
var VerticalPanels = SimpleFlexBox.sub({
    className: "VerticalPanels",
    inherited: {
        orient: "vertical"
    }
});
VerticalPanels.prototype.extend({

    /*
     * The content of the bottom panel.
     */    
    bottom: Control.chain( "_panel2" ),
    
    /*
     * The content of the top panel.
     */
    top: Control.chain( "_panel1" )

});

/*
A labeled check box.
*/
var CheckBox = LabeledInput.sub({
    className: "CheckBox",
    inherited: {
        _type: "checkbox"
    }
});

/*
An input area with a dropdown arrow, which invokes a popup.
*/
var ComboBox = PopupSource.sub({
    className: "ComboBox",
    inherited: {
        closeOnInsideClick: "false",
        openOnClick: "false",
        content: [
            " ",
            {
                html: "<div />",
                ref: "ComboBox_content"
            },
            " ",
            /*
            Negative tabindex prevents tabstop, which isn't necessary here
            as the text box portion will get the focus, and the user can
            invoke the popup from there. E.g., ListComboBox opens the popup
            when the Down key is pressed.
            TODO: Promote Down key behavior from ListComboBox to this class.
            */
            " ",
            {
                control: "ToggleButton",
                ref: "dropdownButton",
                "class": "quiet",
                tabindex: "-1",
                content: "▼"
            },
            " "
        ],
        generic: "true"
    }
});
ComboBox.prototype.extend({

    /*
     * True if the dropdown portion should automatically close if the user
     * presses Enter. Default is true.
     */
    closeOnEnter: Control.property.bool( null, true ),
    
    /*
     * The content of the combo box's input portion.
     */
    content: Control.chain( "$ComboBox_content", "content" ),
    
    /*
     * The content of the dropdown button. By default, this shows a
     * downward-pointing arrow.
     */
    dropdownButtonContent: Control.chain( "$dropdownButton", "content" ),
    
    initialize: function() {
        var self = this;
        this.$PopupSource_popup().on({
            "canceled": function() {
                self.$dropdownButton().selected( false );
            },
            "closed": function() {
                // Closing the popup leaves the text selected.
                // HACK for IE: If we set focus to the input while the popup is
                // being closed, IE won't hide the popup. It seems quite hard
                // to prevent this behavior, so we simply disable the selection
                // behavior in IE.
                if ( !$.browser.msie ) {
                    var content = self.content();
                    self.inputElement().focus();
                    self._selectText( 0, content.length );
                }
                self.$dropdownButton().selected( false );
            }
        });
        
        this.on({
            // Close the popup when the control loses focus.
            "focusout": function( event ) {
                /*
                 * We want to close the popup if the focus moves completely
                 * outside the combo box; i.e., is not within the input box or
                 * the popup. Unfortunately, if the user clicks in the popup,
                 * the input will blur before we've had a chance to even
                 * register the click. And at the point the blur handler here
                 * is invoked, the new activeElement is not yet known, so we
                 * can't test that.  
                 * 
                 * Our solution is to set a timeout which will defer testing
                 * of activeElement until after the normal focusout sequence
                 * has completed and focus has been placed in the new control.
                 */
                if ( self.opened() ) {
                    setTimeout( function() {
                        var focusInControl = $.contains( self[0], document.activeElement );
                        if ( !focusInControl && self.opened() ) { // Still open?
                            self.cancel();
                        }
                    }, 1);
                }
            }
        });
        
        this.$dropdownButton().click( function( event ) {
            self.open();
        });
        
        // Allow the popup container itself to receive the focus.
        // This allows clicks on the popup to still keep focus within the
        // overall ComboBox controls.
        this.$PopupSource_popup().prop( "tabindex", -1 );
       
        if ( !this.textBoxClass() ) {
            // Set a default text box class
            this.textBoxClass( TextBox );
        }
    },
    
    /*
     * Returns the combo box's input element. By default this is the content
     * element itself (if it's a text box) or else the first text input element
     * in the content. Subclasses can override this to indicate that a different
     * element should be used for input.
     */
    inputElement: function() {
        var $content = this.$ComboBox_content();
        if ( $content[0].nodeName.toLowerCase() === "input" && $content.prop( "type" ) === "text" ) {
            // Content itself is a text input element.
            return $content;
        }
        // Return the first text input element.
        return this.$ComboBox_content().find( "input[type='text']" ).eq(0);
    },
    
    /*
     * Open the combo box.
     */
    open: function() {
        if ( !this.opened() ) {
        
            if ( this.hasClass( "generic" ) ) {
                // Make popup at least as wide as content.
                this.eachControl( function( index, $control ) {
                    var width = $control.outerWidth();
                    this.$PopupSource_popup().css( "min-width", width + "px" );
                });
            }
            
            // User may have invoked popup by clicking in text box with
            // openOnFocus true, in which case we should ensure button looks
            // pressed while popup is open.
            this.$dropdownButton().selected( true );
            
        }
        return this._super();
    },

    /*
     * True if the control should automatically open when it receives the
     * keyboard focus. Default is true.
     */
    openOnFocus: Control.property.bool( null, true ),

    /*
     * The class of the text box portion of the combo box.
     */
    textBoxClass: Control.property[ "class" ]( function( textBoxClass ) {
        
        var $textBox = this.$ComboBox_content().transmute( textBoxClass, true );
        this.referencedElement( "ComboBox_content", $textBox );
        
        // Rebind any content events we want to track.
        this._bindContentEvents();
    }),
    
    _bindContentEvents: function() {
        var self = this;
        this.$ComboBox_content().on({
            "click focusin": function( event ) {
                if ( self.openOnFocus() && !self.opened() ) {
                    self.open();
                }
            },
            "keydown": function( event ) {
                if ( event.which === 13 /* Enter key */
                    && self.closeOnEnter()
                    && self.$PopupSource_popup().opened() ) {
                    self.close();
                }
            }
        });
    },

    // Hint for documentation tools.
    _requiresClasses: [ "TextBox" ],

    /*
     * Select the text at the indicated positions in the input control.
     */
    _selectText: function( start, end ) {
        
        var inputElement = this.inputElement()[0];
        if ( !inputElement ) {
            return; // Can't find input control.
        }
        
        if ( inputElement.setSelectionRange ) {
            // Mozilla/WebKit
            inputElement.setSelectionRange( start, end );
        } else if ( inputElement.createTextRange ) {
            // IE
            var range = inputElement.createTextRange();
            range.moveStart( "character", start );
            range.moveEnd( "character", end );
            range.select();
        }
    }

});

/*
Lets user pick a date with a date-optimzed text box or a navigable month calendar.
*/
var DateComboBox = ComboBox.sub({
    className: "DateComboBox",
    inherited: {
        textBoxClass: "DateTextBox",
        popup: [
            " ",
            {
                control: "CalendarMonthNavigator",
                ref: "navigator"
            },
            " "
        ]
    }
});
DateComboBox.prototype.extend({
    
    /*
     * The date indicated in the control.
     */
    date: Control.property( function( date ) {
        
        var time = date && date.getTime();
        
        var textBoxDate = this.$ComboBox_content().date();
        if ( !textBoxDate || textBoxDate.getTime() !== time ) {
            this.$ComboBox_content().date( date );
        }
        
        // Navigator can only handle non-null dates.
        if ( date ) {
            var navigatorDate = this.$navigator().date();
            if ( !navigatorDate || navigatorDate.getTime() !== time ) {
                this.$navigator().date( date );
            }
        }
    }),
    
    initialize: function() {

        // Sync up dates
        this.date( this.$navigator().date() );

        // Changing text updates navigator, and vice versa.
        var self = this;
        this.on({
            "dateChanged": function( event, date ) {
                self.date( date );
            },
            "dateSelected": function( event, date ) {
                self.date( date );
                self.close();
            }
        });
    },

    /*
     * The class used for the dropdown portion of the combo box.
     * By default this is a CalendarMonthNavigator, but it can be set to any
     * class that exposes a date() property.
     */    
    navigatorClass: Control.chain( "$navigator", "transmute" ),
    
    /*
     * True if the user must enter a value in this field.
     */
    required: Control.chain( "$ComboBox_content", "required" )

});

/*
Text box that parses dates.
If Globalize is installed, all of the current culture's local date formats are
supported, plus modified short date formats that permit a missing year or two-
digit year. If Globalize is not installed, a default date parser is used.
*/
var DateTextBox = ValidatingTextBox.sub({
    className: "DateTextBox",
    inherited: {
    }
});
DateTextBox.prototype.extend({

    /*
     * The control's current culture.
     */
    culture: function( culture ) {
        var result = this._super( culture );
        if ( culture !== undefined ) {
            this._updateDatePatterns();
            this._refresh();
        }
        return result;
    },

    /*
     * The date indicated in the text box.
     */
    date: Control.property.date( function( date ) {
        var previousDate = this._previousDate();
        var previousTime = previousDate && previousDate.getTime();
        var time = date && date.getTime();
        var dateChanged = ( previousTime !== time ); 
        if ( dateChanged ) {
            
            var hasFocus = this[0] === document.activeElement;
            if ( !hasFocus ) {
                // We updating the content only if the user isn't typing,
                // so as not to confuse them.
                this._refresh();
            }
            
            this
                ._previousDate( date )
                .trigger( "dateChanged", [ date ] );
        }
    }),
    
    initialize: function() {
        var self = this;
        this.blur( function() {
            self._refresh();
        });
        this._updateDatePatterns();
    },
    
    /*
     * Returns true if the current date is valid. 
     */
    valid: function() {

        var valid = this._super();

        // Convert content text to a date.
        var content = this.content();
        var date = this._parseDate( content );
        this.date( date );

        // If a date is supplied, it has to be valid.
        if ( content && content.length > 0 ) {
            valid = valid && !!date;
        }
        
        return valid;
    },
    
    /*
     * Use a culture's "short date" pattern (e.g., "M/d/yyyy") to determine
     * some abbreviated date patterns.
     * 
     * The first abbreviated pattern uses a short two-digit year ("M/d/yy")
     * instead of a full four-digit year. The second pattern omits the year
     * ("M/d"). These patterns are determined by looking for a full year
     * placeholder ("yyyy") and the culture's date separator ("/") immediately
     * before or after the year.
     */
    _abbreviatedDatePatterns: function( culture ) {
        
        var patterns = [];
        var calendar = culture.calendar;
        var shortPattern = calendar.patterns.d;
        var fullYearPlaceholder = "yyyy";
        
        // Try replacing full four-digit year with short two-digit year.
        if ( shortPattern.indexOf ( fullYearPlaceholder ) ) {
            patterns.push( shortPattern.replace( fullYearPlaceholder, "yy" ));
        }
        
        // Try removing separator + year, then try removing year + separator.
        var separator = calendar[ "/" ];
        var separatorThenYear = separator + fullYearPlaceholder;
        var yearThenSeparator = fullYearPlaceholder + separator;
        if ( shortPattern.indexOf( separatorThenYear ) >= 0 ) {
            patterns.push( shortPattern.replace( separatorThenYear, "" ) );
        } else if ( shortPattern.indexOf( yearThenSeparator ) >= 0 ) {
            patterns.push( shortPattern.replace( yearThenSeparator, "" ) );
        }
        
        return patterns;
    },
    
    _datePatterns: Control.property(),
    
    // Return the separator between dates.
    _dateSeparator: function() {
        var culture = this.culture();
        var calendar = culture ? culture.calendar : DateTextBox;
        return calendar[ "/" ];
    },
    
    _formatDate: function( date ) {
        var culture = this.culture();
        var formattedDate;
        if ( culture ) {
            formattedDate = Globalize.format( date, culture.calendar.patterns.d, culture );
        } else {
            formattedDate = (date.getMonth() + 1) + 
                this._dateSeparator() + date.getDate() +
                this._dateSeparator() + date.getFullYear();
        }
        return formattedDate;
    },

    /*
     * Parse the given text as a date.
     * Use the culture's parser if available, otherwise use a default parser.
     */
    _parseDate: function( text ) {
        var date = this.culture()
            ? Globalize.parseDate( text, this._datePatterns(), this.culture() )
            : this._parseDateDefault( text );
        return date;
    },
    
    /*
     * Basic date parser.
     * Parses the given text as a date and return the result.
     * Returns null if the text couldn't be parsed.
     * 
     * This handles the formats supported by the standard Date.parse(),
     * as well as handling a short year ("1/1/12") or missing year ("1/1").
     */
    _parseDateDefault: function( text ) {

        if ( text === "" ) {
            return null;
        }

        var dateSeparator = this._dateSeparator();
        var parts = text.split( dateSeparator );
        var currentYear = ( new Date() ).getFullYear().toString();
        
        var munged;
        if ( parts.length === 2 ) {
            // Add on year
            munged = text + dateSeparator + currentYear;
        } else if ( parts.length === 3 && parts[2].length == 2 ) {
            // Convert short year to long year
            var fullYear = currentYear.substring(0, 2) + parts[2];
            munged = parts[0] + dateSeparator
                   + parts[1] + dateSeparator
                   + fullYear;
        } else {
            // Parse as is
            munged = text;
        }
        
        var milliseconds = Date.parse( munged );
        var date = isNaN( milliseconds )
            ? null
            : new Date( milliseconds );
        return date;
    },
    
    _refresh: function() {
        var date = this.date();
        if ( !!date ) {
            var formattedDate = this._formatDate( date );
            if ( formattedDate !== this.content() ) {
                this.content( formattedDate );
            }
        }
        return this;
    },
    
    _previousDate: Control.property.date(),
    
    /*
     * If the culture's been set, we amend the list of support date patterns
     * to include some abbreviated patterns.
     */
    _updateDatePatterns: function() {
        var datePatterns = null;
        var culture = this.culture();
        if ( culture ) {
            // Update our date patterns based on the new culture.
            var abbreviatedDatePatterns = this._abbreviatedDatePatterns( culture );
            if ( abbreviatedDatePatterns.length > 0 ) {
                // Add our abbreviated patterns to all the culture's patterns.
                datePatterns = $.map( this.culture().calendar.patterns, function( pattern, name ) {
                    return pattern;
                });
                datePatterns = datePatterns.concat( abbreviatedDatePatterns );
            }
        }
        this._datePatterns( datePatterns );
    }
    
});

/*
 * Class properties.
 */
DateTextBox.extend({
    // Date separator, used when Globalize is not present.
	"/": "/"
});

/*
Base class for modal dialogs.
*/
var Dialog = Popup.sub({
    className: "Dialog",
    inherited: {
        cancelOnOutsideClick: "false",
        cancelOnWindowBlur: "false",
        cancelOnWindowResize: "false",
        cancelOnWindowScroll: "false",
        closeOnInsideClick: "false",
        overlayClass: "ModalOverlay"
    }
});
Dialog.prototype.extend({

    /*
     * Cancel the dialog. This implicitly closes the dialog.
     */    
    cancel: function() {
        return this
            ._super()
            .remove();
    },
    
    /*
     * Close the dialog normally.
     */
    close: function() {
        return this
            ._super()
            .remove();
    },
    
    /*
     * Position the dialog.
     * By default, center dialog horizontally and vertically. 
     */
    positionPopup: function() {
        return this.css({
            left: ( $( window ).width() - this.outerWidth() ) / 2,
            top: ( $( window ).height() - this.outerHeight() ) / 2
        });
    }

});

// Class methods
Dialog.extend({
    
    /*
     * Create and show an instance of a given dialog class.
     */
    showDialog: function( dialogClass, properties, callbackOk, callbackCancel ) {
        
        var dialog = dialogClass.create( properties )
            .on({
                closed: function() {
                    if ( callbackOk ) {
                        callbackOk.call( $( this ).control() );
                    }
                },
                canceled: function() {
                    if ( callbackCancel ) {
                        callbackCancel.call( $( this ).control() );
                    }
                }
            });
        
        var maximumZIndex = Dialog._maximumZIndex();
        if ( maximumZIndex ) {
            /*
             * Use a z-index one higher than the highest one in use on the page.
             * 
             * Technically speaking, we might be able to get away with using a
             * lower z-index if we very carefully looked at the actual stacking
             * contexts, but that would be a bunch more work, and all we care
             * about here is making sure a transient element ends up above
             * everything else.    
             */
            dialog.css( "z-index", maximumZIndex + 1 );
        }
        
        /*
         * Add the dialog to the end of the body so that it will paint over
         * other controls in the same stacking context.
         */
        $( document.body).append( dialog );
        
        dialog.open();
    },
    
    /*
     * Return the maximum Z-index in use on the page, or null if none is set.
     */
    _maximumZIndex: function()
    {
        var zIndices = $( "*" ).map( function( index, element ) {
            var $element = $( element );
            // z-index only applies if position is also set.
            if ( $element.css("position") !== "static" ) {
                var zIndex = parseInt( $element.css( "z-index" ) );
                if ( zIndex ) {
                    return zIndex;
                }
            }
        }).get();
        
        return ( zIndices.length > 0 )
            ? Math.max.apply( null, zIndices )
            : null;
    }
    
});

/* Position a left and/or right panel on the sides of a main content panel. */
var HorizontalPanels = SimpleFlexBox.sub({
    className: "HorizontalPanels",
    inherited: {
        orient: "horizontal"
    }
});
HorizontalPanels.prototype.extend({

    /*
     * The content of the left panel.
     */    
    left: Control.chain( "_panel1" ),

    leftClass: Control.property[ "class" ]( function( leftClass ) {
        var $new = this.$SimpleFlexBox_panel1().transmute( leftClass, true );
        $new.addClass( "panel" );
        this.referencedElement( "SimpleFlexBox_panel1", $new );
    }),
    
    /*
     * The content of the right panel.
     */
    right: Control.chain( "_panel2" ),

    rightClass: Control.property[ "class" ]( function( right ) {
        var $new = this.$SimpleFlexBox_panel2().transmute( right, true );
        $new.addClass( "panel" );
        this.referencedElement( "SimpleFlexBox_panel2", $new );
    })

});

/*
Renders a list of items in a combo box.

The user can type arbitrary text; if they type the beginning of a list item's
content, the remainder of the item's content is AutoCompleted. For this to
work, both the control's content and the content of the list items should
be strings.
*/
var ListComboBox = ComboBox.sub({
    className: "ListComboBox",
    inherited: {
        popup: [
            " ",
            {
                control: "ListBox",
                ref: "list"
            },
            " "
        ]
    }
});
ListComboBox.prototype.extend({
    
    
    /*
     * The array of items in the dropdown list. See List for details.
     */
    items: Control.chain( "$list", "items", function() { this._updateItemContents(); } ),
    
    /*
     * A mapping of items to controls and back. See List for details.
     */
    mapFunction: Control.chain( "$list", "mapFunction" ),
    
    initialize: function() {
        var self = this;
        this.$list().on({
        
            click: function( event ) {
                // Clicking a list item puts its content into the text box portion.
                var $closestItem = $( event.target ).closest( self.$list().children() );
                if ( $closestItem ) {
                    var itemContent = $closestItem.control().content();
                    self
                        .content( itemContent )
                        .close();
                }
            },
            
            keydown: function( event ) {
                if ( event.which === 13 /* Enter */) {
                    if ( self.opened() ) {
                        self.close();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                }
            },
            
            selectionChanged: function() {
                var selectedControl = self.$list().selectedControl();
                if ( selectedControl ) {
                    var content = selectedControl.content();
                    if ( content !== self.content() ) {
                        self.content( content );
                        self._selectText( 0, content.length );
                    }
                }
            }
                
        });
    },
    
    /*
     * The class which should be used to render the list items as controls.
     */
    itemClass: Control.property[ "class" ]( function( itemClass ) {
        this.$list().itemClass( itemClass );
    }),
    
    open: function() {

        // See if current text is in the list and, if so, select it.
        var content = this.content();
        var index = $.inArray( content, this._itemContents() );
        if ( index >= 0 ) {
            this.$list().selectedIndex( index );
        }
        
        var result = this._super();
        
        // Give the input control focus if it doesn't already have it.
        var inputElement = this.inputElement();
        if ( document.activeElement !== inputElement[0] ) {
            this.inputElement().focus();
        }
        
        return result;
    },
    
    // Try to auto-complete the current text against the item contents.
    _autoComplete: function() {
        
        var content = this.content();
        
        var match = this._matchingItem( content );
        if ( !match ) {
            this.$list().selectedControl( null );
            return;
        }

        this.content( match );
        
        // Select the auto-completed text.
        this._selectText( content.length, match.length );
        
        this._selectTextInList();
    },
    
    _bindContentEvents: function() {
        
        this._super();
        
        // See notes at _contentKeydown.
        var self = this;
        this.inputElement().keydown( function( event ) {
            self._contentKeydown( event );
        });
    },
    
    /*
     * Handle a keydown event. Keydown gives the best AutoComplete performance
     * and behavior: among other things, the AutoComplete happens as soon as
     * the user begins typing. However, using keydown creates a problem that
     * the input control's content won't actually reflect the effects key the
     * user just pressed down. So we set a timeout to give the keydown event a
     * chance to bubble up and do its work, then do our AutoComplete work
     * against the resulting text.
     */
    _contentKeydown: function( event ) {
        
        var handled = false;
        var navigationKeys = [
            33, // Page Up
            34, // Page Down
            38, // Up
            40 // Down
        ];
        var self = this;
        
        // Do AutoComplete on Space, or characters from zero (0) and up,
        // ignoring any combinations that involve Alt or Ctrl.
        if ( ( event.which === 32 || event.which >= 48 ) 
            && !( event.altKey || event.ctrlKey || event.metaKey) ) {

            this._setTimeout( function() { self._autoComplete(); });
            
        } else if ( this.opened() && $.inArray( event.which, navigationKeys ) >= 0 ) {
            
            // Forward navigation keys to opened list.
            this.$list().trigger( event );
            handled = true;

        } else if ( event.which === 8 || event.which === 46 ) {
            
            // On Backspace or Delete, clear list select if text is empty.
            this._setTimeout( function() {
                self._selectTextInList();
            });
            
        } else if ( event.which === 40 ) {
            
            // Pressing Down when list is closed will open list.
            this.open();
            
            // If the input text is empty, select the first list item.
            var content = this.content();
            if ( content == null || content.length === 0 ) {
                this.$list().selectedIndex( 0 );
            }

            handled = true;
            
        }
        
        if ( handled ) {
            event.stopPropagation();
            event.preventDefault();
        }
    },

    _itemContents: Control.property(),
    
    // Return the item whose prefix matches the given string, ignoring case.
    // Return null if not found.
    _matchingItem: function( s ) {
        var length = s.length;
        if ( length > 0 ) {
            var lower = s.toLowerCase();
            var itemContents = this._itemContents();
            for ( var i = 0, itemCount = itemContents.length; i < itemCount; i++ ) {
                var itemContent = itemContents[i]; 
                if ( length <= itemContent.length
                    && itemContent.substr( 0, length ).toLowerCase() === lower ) {
                    return itemContent;
                }
            }
        }
        return null;
    },

    // Select the current input text in the list if it's there.
    // Clear the list selection if the text is not found.
    _selectTextInList: function() {
        if ( this.opened() ) {
            var content = this.content();
            var index = $.inArray( content, this._itemContents() );
            this.$list().selectedIndex( index );
        }
    },
    
    // Arrange for a callback to be performed via a timeout.
    // See notes at _contentKeydown.
    _setTimeout: function( callback ) {
        
        // Cancel any pending AutoComplete timeout.
        var timeout = this._timeout();
        if ( timeout ) {
            clearTimeout( timeout );
        }
        
        // Queue a new timeout.
        var self = this;
        timeout = window.setTimeout( callback, 50 );
        this._timeout( timeout );
    },
    
    _timeout: Control.property(),
    
    /*
     * Extract a copy of all the items so we can match against them when
     * the user types. We get the contents from the list's controls, rather
     * than from the list's items() property, since the items could be
     * arbitrary JavaScript objects. Once the list's mapFunction has mapped
     * those objects into the controls, the controls' content should best
     * reflect the text to map against. 
     */
    _updateItemContents: function() {
        var itemContents = [];
        this.$list().controls().eachControl( function( index, $control ) {
            itemContents.push( $control.content() );
        });
        this._itemContents( itemContents );
    }

});

/* A popup menu. This is typically used in a Menu bar. */
var Menu = PopupSource.sub({
    className: "Menu",
    inherited: {
        popup: [
            " ",
            {
                html: "<div />",
                ref: "shield"
            },
            " ",
            /* Used to obscure borders between description and content. */
            " ",
            {
                html: "<div />",
                ref: "Menu_popup"
            },
            " "
        ],
        generic: "true"
    }
});
Menu.prototype.extend({
    
    /*
     * The menu's descriptive label. Clicking this will open the menu.
     */
    content: function( content ) {
        var result = this._super( content );
        if ( content !== undefined && this.inDocument() ) {
            this._updateShield();
        }
        return result;
    },
     
    initialize: function() {
        var self = this;
        this.inDocument( function() {
            this._updateShield();
        });
        this.$PopupSource_popup().on( "click", function( event ) {
            // Absorb clicks outside of menu items.
            var $menuItem = $( event.target ).closest( ".MenuItem" );
            if ( $menuItem.length === 0 ) {
                event.stopPropagation();
            }
        });
    },
    
    popup: Control.chain( "$Menu_popup", "content" ),
    
    // Hint for documentation tools.
    _requiresClasses: [ "MenuItem" ],

    /*
     * The "shield" is a thin block that can be used to obscure the boundary
     * between the content and popup so that those two elements can
     * appear to exist on a seamless surface. For this to work, the shield
     * needs to be (almost) as wide as the description. 
     */
    _updateShield: function() {
        // We want the width of the content including padding, but not
        // including border.
        var $content = this.$PopupSource_content();
        var shieldWidth = $content.width()
            + parseInt( $content.css( "padding-left" ) )
            + parseInt( $content.css( "padding-right" ) );
        this.$shield().width( shieldWidth );
    }
    
});

/* An overlay for a modal dialog which absorbs all clicks. */
var ModalOverlay = Overlay.sub({
    className: "ModalOverlay",
    inherited: {
    }
});
ModalOverlay.prototype.extend({
    
    initialize: function() {
        var self = this;
        this.on({
            
            click: function( event ) {
                /*
                 * When a ModalOverlay is invoked by a Dialog, the Popup itself
                 * will ignore mouse clicks anyway. We still absorb mouse
                 * clicks here in case the ModalOverlay were to be used in some
                 * context other than a Popup.
                 */
                event.stopPropagation();
            },
            
            "DOMMouseScroll mousewheel": function( event) {
                // Prevent wheel scrolls over overlay from scrolling underlying
                // page, which is sort of disconcerting when a modal dialog
                // is up.
                event.preventDefault();
            }
            
        });
    },

});

/* Pick exactly one child to show at a time. */
var Modes = Sequence.sub({
    className: "Modes",
    inherited: {
    }
});
Modes.prototype.extend({

    initialize: function() {
        var self = this;
        this.on( "layout sizeChanged", function() {
            self._sizeChanged();
        });
        this.inDocument( function() {
            this._sizeChanged();
        });
    },
    
    /*
     * True if the control should always adjust its own height to be as tall
     * as its tallest child, whether or not that child is currently active.
     */
    maximize: Control.chain( "applyClass/maximize" ),
    
    /*
     * The size of a child may have changed. Make the control as tall as the
     * tallest child.
     */
    _sizeChanged: function() {

        if ( !this.maximize() ) {
            return;
        }
        
        var elements = this.elements();
        if ( elements.length === 0 ) {
            return;
        }
        
        var childHeights = elements.map( function( index, child ) {
            return $( child ).outerHeight( true );
        }).get();
        
        var maxChildHeight = Math.max.apply( this, childHeights );
        if ( maxChildHeight > 0 ) {
            this.height( maxChildHeight );
        }
    }
        
});

/* A button that produces a popup when clicked. */
var PopupButton = PopupSource.sub({
    className: "PopupButton",
    inherited: {
        contentClass: "BasicButton",
        content: [
            " ",
            {
                html: "<div />",
                ref: "PopupButton_content"
            },
            " ",
            {
                html: "<div>▼</div>",
                ref: "indicator"
            },
            " "
        ],
        generic: "true"
    }
});
PopupButton.prototype.extend({
    
    /*
     * The content of the button.
     */
    content: Control.chain( "$PopupButton_content", "content", function( content ) {
        var hasContent = content && content.length > 0;
        this.$PopupButton_content().css( "display", hasContent ? "inline-block" : "none" );
    }),
    
    /*
     * Content which indicates the button can be clicked to produce a popup.
     * The default indicator is a downward-pointing arrow. 
     */
    indicator: Control.chain( "$indicator", "content" ),

    quiet: Control.chain( "$PopupSource_content", "quiet" )

});

/*
Rotates once through a set of elements automatically when control is loaded.
The rotation stops if the user clicks to navigate to a specific page.
*/
var RotatingPanelsWithDots = SlidingPanelsWithDots.sub({
    className: "RotatingPanelsWithDots",
    inherited: {
    }
});
RotatingPanelsWithDots.prototype.extend({
    
    initialize: function() {
        var self = this;
        this
            .click( function() { self.stop(); })
            .inDocument( function() { this._queueRotation(); });
    },
    
    /*
     * Rotates to the next page. When it hits the last one, it rotates
     * back to the first page and stops.
     */
    rotate: Control.iterator( function () {
        var count = this.elements().length;
        if ( count > 0 ) {
            
            var index = this.activeIndex();
            index = ( index + 1 ) % count;
            this.activeIndex( index );
            if ( index > 0 ) {
                this._queueRotation();
            }
        }
    }),
    
    /*
     * Interval between rotation animations. This does not include the duration
     * of the sliding animation. The default value is 1000 (one second).
     */
    rotationInterval: Control.property.integer( null, 1000 ),

    /*
     * Stop the rotation in progress.
     */
    stop: Control.iterator( function() {
        clearTimeout( this._timeout() );
        this._timeout( null );
        return this;
    }),
    
    _queueRotation: function() {
        var rotationInterval = this.rotationInterval();
        var self = this;
        this._timeout( setTimeout( function() { self.rotate(); }, rotationInterval ) );
    },
    
    _timeout: Control.property(),

});

var SampleSpriteButton = SpriteButton.sub({
    className: "SampleSpriteButton",
    inherited: {
        image: "url(/catalog/resources/sampleButtonStates.png)",
        cellHeight: "32"
    }
});

var ColorSwatchComboBox = ListComboBox.sub({
    className: "ColorSwatchComboBox",
    inherited: {
        textBoxClass: "ColorSwatchTextBox",
        itemClass: "LabeledColorSwatch"
    }
});
ColorSwatchComboBox.prototype.extend({
    initialize: function() {
        if ( this.items() == null || this.items().length === 0 ) {
            this.items([
                "Black",
                "Blue",
                "Gray",
                "Green",
                "Red",
                "Orange",
                "Pink",
                "Purple",
                "Yellow"
            ]);
        }
    }
});

/* A control with separate edit and read modes. */
var Editable = Modes.sub({
    className: "Editable",
    inherited: {
        content: [
            " ",
            {
                html: "<div tabindex=\"-1\" />",
                ref: "Editable_read"
            },
            " ",
            {
                html: "<div />",
                ref: "Editable_edit"
            },
            " "
        ],
        generic: "true"
    }
});
Editable.prototype.extend( {

    /*
     * Cancel any pending changes and revert to read mode.
     */
    cancel: Control.iterator( function() {
        this.editing( false );
    }),
    
    /*
     * The current content in either mode.
     */
    content: function( value ) {
        return this.editing()
            ? this._editContent( value )
            : this._readContent( value );
    },
    
    /*
     * The class of the content in edit mode. This class is not instantiated
     * until editing() is set to true for the first time.
     */
    editClass: Control.property[ "class" ]( function( editClass ) {
        if ( this.editing() ) {
            // Transmute the edit control to the new class.
            this._ensureEditControl();
        }
    }),
    
    /*
     * The control used for editing.
     */
    editControl: Control.chain( "$Editable_edit" ),
    
    /*
     * True if the control is in edit mode, false if in read mode. By default,
     * this is false.
     */
    editing: Control.chain( "applyClass/editing", function( editing ) {
        if ( editing === undefined ) {
            // Getter
            return this._editing();
        } else {
            // Setter
            return this.eachControl( function() {
                if ( editing ) {
                    // Switch to edit mode.

                    // Copy content from read to edit mode.
                    // This will create the edit control if necessary.
                    this._editContent( this._readContent() );

                    this.activeElement( this.$Editable_edit() );
                } else {
                    // Switch to read mode.
                    this.activeElement( this.$Editable_read() );
                    this.readControl().focus();
                }
            });
        }
    }),
    
    /* The class of the content in read mode. */
    readClass: Control.property[ "class" ]( function( readClass ) {
        var $new = this.$Editable_read().transmute( readClass, true );
        this.referencedElement( "Editable_read", $new );
    }),
    
    /*
     * The control used for reading.
     */
    readControl: Control.chain( "$Editable_read" ),

    /*
     * Save changes and return to read mode.
     */
    save: Control.iterator( function() {
        this._readContent( this._editContent() );
        this.editing( false );
    }),
    
    /* The content of the edit portion */
    _editContent: function( content ) {
        this._ensureEditControl();
        return this.$Editable_edit().content( content );
    },

    _createEditControl: function() {
        var editClass = this.editClass();
        var $new = this.$Editable_edit().transmute( editClass, true );
        this.referencedElement( "Editable_edit", $new );
    },

    /*
     * Make sure we have an edit control of the desired class. If not, create
     * one.
     */
    _ensureEditControl: function() {
        var currentClass = this.$Editable_edit().controlClass()
        var desiredClass = this.editClass();
        if ( desiredClass !== currentClass ) {
            this._createEditControl();
        }
    },
    
    /* The content of the read portion */
    _readContent: function( content ) {
        var result;
        if ( content === undefined ) {
            var result = this.$Editable_read().content();
            if ( result instanceof jQuery && result.length === 0 ) {
                // Convert empty jQuery array to null.
                result = null;
            }
        } else {
            this.$Editable_read().content( content );
            result = this;
        }
        return result;
    }

} );

/* A text region that can be clicked to edit its contents. */
var EditableText = Editable.sub({
    className: "EditableText",
    inherited: {
        editClass: "TextBox"
    }
});
EditableText.prototype.extend({

	/*
	 * True if the pressing Escape in edit mode cancels edit mode.
	 * The default is true.
	 */
	cancelOnEscape: Control.property( null, true ),

	editing: function( editing ) {
		result = this._super( editing );
		if ( editing ) {
			// Switching to edit mode; put focus in the text box.
			this.editControl().find( "input" ).andSelf().focus();
		}
		return result;
	},

    /*
     * True if the control should switch to editing mode when it's clicked.
     * Default is true.
     */
    editOnClick: Control.property( null, true ),

    initialize: function() {
        var self = this;
        this.on({
        	click: function() {
	            if ( self.editOnClick() && !self.editing() ) {
	                self.editing( true );
	            }
            }
        });
    },

    /*
     * True if pressing the Enter key in edit mode saves changes and switches
     * back to read mode. The default is true.
     */
    saveOnEnter: Control.property( null, true ),

    _createEditControl: function() {
    	var result = this._super();

        // Wire up events bound to input elements.
    	var self = this;
        this.editControl().find( "input" ).andSelf().on({
            blur: function() {
                if ( self.editing() ) {
                    // Implicitly save when control loses focus.
                    self.save();
                }
            },
            keydown: function( event ) {
                if ( self.editing() ) {
                    switch ( event.which ) {
                        case 13: // Enter
                            if ( self.saveOnEnter() ) {
                                self.save();
                                event.preventDefault();
                            }
                            break;
                        case 27: // Escape
                            if ( self.cancelOnEscape() ) {
                                self.cancel();
                            }
                            break;
                    }
                }
            }
        });

        return result;
    }

});


// Generated by CoffeeScript 1.3.3

/*
Shows a month, allowing using to navigate months and select a date.
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.CalendarMonthNavigator = (function(_super) {

    __extends(CalendarMonthNavigator, _super);

    function CalendarMonthNavigator() {
      return CalendarMonthNavigator.__super__.constructor.apply(this, arguments);
    }

    CalendarMonthNavigator.prototype.inherited = {
      content: [
        {
          control: "LateralNavigator",
          ref: "navigator",
          align: "center",
          content: {
            control: "MonthAndYear",
            ref: "monthHeading"
          }
        }, {
          control: "CalendarMonthWithHeadings",
          ref: "calendar",
          showMonthAndYear: false
        }, {
          html: "div",
          ref: "todayContainer",
          content: {
            control: "BasicButton",
            ref: "buttonToday",
            "class": "quiet",
            content: "Today"
          }
        }
      ],
      generic: true
    };

    CalendarMonthNavigator.prototype.culture = function(culture) {
      var result;
      result = CalendarMonthNavigator.__super__.culture.call(this, culture);
      if (culture !== void 0) {
        this.$monthHeading().culture(culture);
        this.$calendar().culture(culture);
      }
      return result;
    };

    CalendarMonthNavigator.prototype.date = Control.property(function(date) {
      if (this.$calendar().date().getTime() !== date.getTime()) {
        this.$calendar().date(date);
      }
      this.$monthHeading().date(date);
      return this._applySelection();
    });

    CalendarMonthNavigator.prototype.dayClass = Control.property["class"](function(dayClass) {
      return this.$calendar().dayClass(dayClass);
    });

    CalendarMonthNavigator.prototype.dayNameFormat = Control.chain("$calendar", "dayNameFormat");

    CalendarMonthNavigator.prototype.initialize = function() {
      var _this = this;
      this.on({
        dateChanged: function(event, date) {
          return _this.date(date);
        },
        dateSelected: function(event, date) {
          return _this.$calendar().date(date);
        }
      });
      this.$navigator().on({
        next: function() {
          return _this.next();
        },
        previous: function() {
          return _this.previous();
        }
      });
      this.$buttonToday().click(function() {
        return _this.trigger("dateSelected", [CalendarDay.today()]);
      });
      if (!this.dayClass()) {
        this.dayClass(CalendarDayButton);
      }
      if (!this.date()) {
        return this.date(this.$calendar().date());
      }
    };

    CalendarMonthNavigator.prototype.next = function() {
      return this._adjustMonth(1);
    };

    CalendarMonthNavigator.prototype.nextButtonContent = Control.chain("$navigator", "nextButtonContent");

    CalendarMonthNavigator.prototype.nextButtonDisabled = Control.chain("$navigator", "nextButtonDisabled");

    CalendarMonthNavigator.prototype.previous = function() {
      return this._adjustMonth(-1);
    };

    CalendarMonthNavigator.prototype.previousButtonContent = Control.chain("$navigator", "previousButtonContent");

    CalendarMonthNavigator.prototype.previousButtonDisabled = Control.chain("$navigator", "previousButtonDisabled");

    CalendarMonthNavigator.prototype.showSelectedDate = Control.property.bool(function(showSelectedDate) {
      return this._applySelection();
    }, true);

    CalendarMonthNavigator.prototype.showTodayButton = Control.chain("$todayContainer", "visibility");

    CalendarMonthNavigator.prototype._adjustMonth = function(direction) {
      var adjustment, dayOfMonth, newDate;
      adjustment = (direction > 0 ? 1 : -1);
      newDate = new Date(this.date().getTime());
      dayOfMonth = newDate.getDate();
      newDate.setMonth(newDate.getMonth() + adjustment);
      if (newDate.getDate() !== dayOfMonth) {
        newDate.setDate(0);
      }
      return this.date(newDate);
    };

    CalendarMonthNavigator.prototype._applySelection = function() {
      var dayControl;
      this.$calendar().$days().removeClass("selected");
      if (this.showSelectedDate()) {
        dayControl = this.$calendar().dayControlForDate(this.date());
        return dayControl.addClass("selected");
      }
    };

    CalendarMonthNavigator.prototype._requiresClasses = ["CalendarDayButton"];

    return CalendarMonthNavigator;

  })(Control);

  /*
  Shows the most interesting photo for each day of a month
  
  Note: This makes a *separate call* to Flickr's REST API for each day of the
  month, which is terrible. Unfortunately, Flickr's API doesn't allow allow a way
  to get the most interesting photo for each day of the month; separate calls have
  to be made per day.
  */


  window.FlickrInterestingNavigator = (function(_super) {

    __extends(FlickrInterestingNavigator, _super);

    function FlickrInterestingNavigator() {
      return FlickrInterestingNavigator.__super__.constructor.apply(this, arguments);
    }

    FlickrInterestingNavigator.prototype.className = "FlickrInterestingNavigator";

    FlickrInterestingNavigator.prototype.inherited = {
      dayClass: "FlickrInterestingDay",
      dayNameFormat: "namesAbbr",
      generic: "false",
      previousButtonContent: [
        {
          html: "span",
          "class": "chevron",
          content: "«"
        }, " ", {
          control: "MonthAndYear",
          ref: "previousMonthName",
          "class": "monthButtonName"
        }
      ],
      nextButtonContent: [
        {
          control: "MonthAndYear",
          ref: "nextMonthName",
          "class": "monthButtonName"
        }, " ", {
          html: "span",
          "class": "chevron",
          content: "»"
        }
      ],
      showTodayButton: "false"
    };

    FlickrInterestingNavigator.prototype.culture = function(culture) {
      var result;
      result = FlickrInterestingNavigator.__super__.culture.call(this, culture);
      if (culture !== void 0) {
        this.$previousMonthName().culture(culture);
        this.$nextMonthName().culture(culture);
      }
      return result;
    };

    FlickrInterestingNavigator.prototype.date = function(date) {
      var nextMonth, previousMonth, result, today;
      result = FlickrInterestingNavigator.__super__.date.call(this, date);
      if (date !== void 0) {
        previousMonth = new Date(date.getTime());
        previousMonth.setMonth(previousMonth.getMonth() - 1);
        this.$previousMonthName().date(previousMonth).checkForSizeChange();
        nextMonth = new Date(date.getTime());
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.$nextMonthName().date(nextMonth).checkForSizeChange();
        today = new Date();
        nextMonth.setDate(1);
        this.nextButtonDisabled(nextMonth > today);
        this.$calendar().$days().loadPhoto();
      }
      return result;
    };

    return FlickrInterestingNavigator;

  })(CalendarMonthNavigator);

  /*
  Lets user navigate content by moving left (backward) and right (forward).
  */


  window.LateralNavigator = (function(_super) {

    __extends(LateralNavigator, _super);

    function LateralNavigator() {
      return LateralNavigator.__super__.constructor.apply(this, arguments);
    }

    LateralNavigator.prototype.inherited = {
      "class": "center",
      content: {
        control: HorizontalPanels,
        ref: "panels",
        content: {
          html: "div",
          ref: "LateralNavigator_content"
        },
        left: {
          control: BasicButton,
          ref: "LateralNavigator_previousButton",
          "class": "navigatorButton quiet",
          content: "&#9664;"
        },
        right: {
          control: BasicButton,
          ref: "LateralNavigator_nextButton",
          "class": "navigatorButton quiet",
          content: "&#9654;"
        },
        tabindex: -1
      },
      generic: true
    };

    LateralNavigator.prototype.align = function(align) {
      this.toggleClass("center", align === "center");
      return this;
    };

    LateralNavigator.prototype.canGoNext = function() {
      return true;
    };

    LateralNavigator.prototype.canGoPrevious = function() {
      return true;
    };

    LateralNavigator.prototype.content = Control.chain("$LateralNavigator_content", "content", function() {
      return this._updateButtons();
    });

    LateralNavigator.prototype.contentClass = Control.property["class"](function(contentClass) {
      var $new;
      $new = this.$LateralNavigator_content().transmute(contentClass, true);
      return this.referencedElement("LateralNavigator_content", $new);
    });

    LateralNavigator.prototype.initialize = function() {
      var _this = this;
      this.$LateralNavigator_previousButton().click(function() {
        return _this._previousClick();
      });
      this.$LateralNavigator_nextButton().click(function() {
        return _this._nextClick();
      });
      this.on({
        keydown: function(event) {
          switch (event.which) {
            case 37:
              if (!_this.$LateralNavigator_previousButton().disabled()) {
                return _this._previousClick();
              }
              break;
            case 39:
              if (!_this.$LateralNavigator_nextButton().disabled()) {
                return _this._nextClick();
              }
          }
        },
        sizeChanged: function() {
          _this.$panels().$SimpleFlexBox_panel1().checkForSizeChange();
          return _this.$panels().$SimpleFlexBox_panel2().checkForSizeChange();
        }
      });
      return this._updateButtons();
    };

    LateralNavigator.prototype.next = function() {};

    LateralNavigator.prototype.nextButtonContent = Control.chain("$LateralNavigator_nextButton", "content");

    LateralNavigator.prototype.nextButtonDisabled = Control.chain("$LateralNavigator_nextButton", "disabled");

    LateralNavigator.prototype.previous = function() {};

    LateralNavigator.prototype.previousButtonContent = Control.chain("$LateralNavigator_previousButton", "content");

    LateralNavigator.prototype.previousButtonDisabled = Control.chain("$LateralNavigator_previousButton", "disabled");

    LateralNavigator.prototype._nextClick = function() {
      this.next();
      this._updateButtons();
      return this.trigger("next");
    };

    LateralNavigator.prototype._previousClick = function() {
      this.previous();
      this._updateButtons();
      return this.trigger("previous");
    };

    LateralNavigator.prototype._updateButtons = function() {
      this.nextButtonDisabled(!this.canGoNext());
      return this.previousButtonDisabled(!this.canGoPrevious());
    };

    return LateralNavigator;

  })(Control);

  /*
  A link in a mobile application, typically in a list.
  After a tap, the link will hold a "tapFeedback" for a short duration.
  */


  window.MobileLink = (function(_super) {

    __extends(MobileLink, _super);

    function MobileLink() {
      return MobileLink.__super__.constructor.apply(this, arguments);
    }

    MobileLink.prototype.initialize = function() {
      var _this = this;
      return this.click(function() {
        _this.addClass("tapFeedback");
        return setTimeout((function() {
          return _this.removeClass("tapFeedback");
        }), 250);
      });
    };

    return MobileLink;

  })(Link);

  /*
  A list of links on a mobile device.
  
  Note, while the items in the list will appear (and should behave) like links,
  they don't actually have to be implemented links (e.g., as anchor tags or Link
  controls.)
  
  This currently uses an iOS visual style.
  TODO: Detect Android and use appropriate Android style.
  */


  window.MobileLinkList = (function(_super) {

    __extends(MobileLinkList, _super);

    function MobileLinkList() {
      return MobileLinkList.__super__.constructor.apply(this, arguments);
    }

    MobileLinkList.prototype.tag = "ul";

    return MobileLinkList;

  })(List);

  window.MobileListBox = (function(_super) {

    __extends(MobileListBox, _super);

    function MobileListBox() {
      return MobileListBox.__super__.constructor.apply(this, arguments);
    }

    MobileListBox.prototype.inherited = {
      itemClass: "MobileLink"
    };

    MobileListBox.prototype.tag = "ul";

    return MobileListBox;

  })(ListBox);

  window.MonthAndYear = (function(_super) {

    __extends(MonthAndYear, _super);

    function MonthAndYear() {
      return MonthAndYear.__super__.constructor.apply(this, arguments);
    }

    MonthAndYear.prototype.inherited = {
      content: [
        {
          control: MonthName,
          ref: "monthName"
        }, " ", {
          html: "span",
          ref: "year"
        }
      ],
      generic: true
    };

    MonthAndYear.prototype.culture = function(culture) {
      var result;
      result = MonthAndYear.__super__.culture.call(this, culture);
      if (culture !== void 0) {
        this.$monthName().culture(culture);
      }
      return result;
    };

    MonthAndYear.prototype.date = Control.property.date(function(date) {
      this.$monthName().month(date.getMonth());
      return this.$year().content(date.getFullYear());
    });

    MonthAndYear.prototype.initialize = function() {
      if (!this.date()) {
        return this.date(new Date());
      }
    };

    return MonthAndYear;

  })(Control);

  /*
  Navigates left and right through its children.
  */


  window.SequenceNavigator = (function(_super) {

    __extends(SequenceNavigator, _super);

    function SequenceNavigator() {
      return SequenceNavigator.__super__.constructor.apply(this, arguments);
    }

    SequenceNavigator.prototype.inherited = {
      contentClass: Modes
    };

    SequenceNavigator.prototype.canGoNext = function() {
      return this.$LateralNavigator_content().activeIndex() < this.elements().length - 1;
    };

    SequenceNavigator.prototype.canGoPrevious = function() {
      return this.$LateralNavigator_content().activeIndex() > 0;
    };

    SequenceNavigator.prototype.elements = Control.chain("$LateralNavigator_content", "elements");

    SequenceNavigator.prototype.initialize = function() {
      if (this.contentClass() === void 0) {
        return this.contentClass({
          control: Modes,
          maximize: true
        });
      }
    };

    SequenceNavigator.prototype.next = function() {
      return this.$LateralNavigator_content().next();
    };

    SequenceNavigator.prototype.previous = function() {
      return this.$LateralNavigator_content().previous();
    };

    return SequenceNavigator;

  })(LateralNavigator);

  /*
  Vertically align children using CSS flexbox layout if available, and manual
  layout if not.
  */


  window.VerticalAlign = (function(_super) {

    __extends(VerticalAlign, _super);

    function VerticalAlign() {
      return VerticalAlign.__super__.constructor.apply(this, arguments);
    }

    VerticalAlign.prototype.initialize = function() {
      return this.inDocument(function() {
        return this._checkFlexBox();
      });
    };

    VerticalAlign.prototype._checkFlexBox = function() {
      var flexBox, handlingLayout, needLayout,
        _this = this;
      if (!this.inDocument()) {
        return false;
      }
      flexBox = SimpleFlexBox.usingFlexBox(this);
      this._usingFlexBox(flexBox);
      handlingLayout = this._handlingLayout();
      needLayout = !flexBox;
      if (needLayout && !handlingLayout) {
        this.on("layout sizeChanged", function() {
          return _this._layout();
        });
        this._handlingLayout(true);
      } else if (!needLayout && handlingLayout) {
        this.off("layout sizeChanged");
        this._handlingLayout(false);
      }
      return flexBox;
    };

    VerticalAlign.prototype._handlingLayout = Control.property.bool(null, false);

    VerticalAlign.prototype._layout = function() {
      var availableSpace, child, childrenHeight, paddingTop, _i, _len, _ref;
      this.css("padding-top", "");
      childrenHeight = 0;
      _ref = this.children();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        childrenHeight += $(child).outerHeight();
      }
      availableSpace = Math.max(this.height() - childrenHeight, 0);
      paddingTop = availableSpace / 2;
      if (paddingTop > 0) {
        return this.css("padding-top", paddingTop);
      }
    };

    VerticalAlign.prototype._usingFlexBox = function(usingFlexBox) {
      if (usingFlexBox === void 0) {
        return !this.hasClass("noFlexBox");
      } else {
        return this.toggleClass("noFlexBox", !usingFlexBox);
      }
    };

    return VerticalAlign;

  })(Control);

  /*
  Navigates through its children with a sliding transition.
  */


  window.Carousel = (function(_super) {

    __extends(Carousel, _super);

    function Carousel() {
      return Carousel.__super__.constructor.apply(this, arguments);
    }

    Carousel.prototype.inherited = {
      contentClass: SlidingPanels
    };

    return Carousel;

  })(SequenceNavigator);

}).call(this);
