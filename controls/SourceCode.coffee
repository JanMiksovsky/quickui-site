###
Show a block of source code.

Code is colorized using the excellent highlight.js plugin, which can be found at
http://softwaremaniacs.org/soft/highlight/en/. The highlight.js script must be
loaded for code to be colorized.
###

class window.SourceCode extends Control

  inherited:
    generic: "true"
  
  initialize: ->
    #.addClass(  "language-html"  )
    @inDocument ->
      if @_needsRefresh()
        @_refresh()
        @_needsRefresh false

  content: Control.property ( content ) ->
    if @inDocument()
      @_refresh()
    else
      @_needsRefresh true
  
  tag: "pre"

  # TODO: Remove this complexity once Highlight.js can handle working against a
  # pre element not in the DOM.
  _needsRefresh: Control.property.bool()

  _refresh: ->
    
    # To simplify the use of this control with CDATA elements, which add extra
    # space unless the CDATA and its contents are jammed against the opening
    # SourceCode tag, we trim whitespace at the beginning and end of the
    # contents.
    text = $.trim @content()
    
    # Remove carriage returns so IE8 doesn't render extra lines.
    text = text.replace /\r/g, ""
    
    # Using $.text() escapes the HTML/XML in the content.
    @empty().text text
    
    # Colorize code with highlight.js if installed
    if window.hljs
      # HACK: disable highlighting in IE8, which does weird things with
      # formatted XML tags, until this can be resolved.
      if not Control.browser.msie or parseInt( Control.browser.version ) >= 9
        @each ( index, element ) ->
          hljs.highlightBlock element
