#
#Display a chunk of text that may have line breaks, tabs, and/or HTML entities.
#
#This control handles common cases where one wants to render an arbitrary
#block of text. Using $.text() won't suffice, because that won't handle
#line breaks. Using $.html() doesn't always work either, because HTML
#entities (e.g., "<") found in the text will get interpreted as HTML instead of
#being rendered as plain text.
#
#This uses a pre tag to render the text, but applies the control's own font
#If the control has a proportionally-spaced font, the pre tag will end up with that
#instead of the default pre styling.
#
Text = Control.sub(className: "Text")
Text::extend
  _spacesForTab: Control.property()
  content: Control.property((content) ->
    
    # Map line breaks to break tags, special characters to entities,
    # tabs to spaces;
    # Ampersands before other entities
    html = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")
    spacesForTab = @_spacesForTab()
    html = html.replace(/\t/g, spacesForTab)  if spacesForTab
    
    # Convert runs of remaining whitespace to non-breaking spaces.
    regex = /\s\s+/g
    match = regex.exec(html)
    while match isnt null
      whitespace = match[0]
      length = whitespace.length
      index = match.index
      nonBreakingSpaces = Array(length + 1).join("&nbsp;")
      html = html.slice(0, index) + nonBreakingSpaces + html.slice(index + length)
      match = regex.exec(html)
    @html html
  )
  
  #
  #     * If set, tabs in the file will be replaced this this many non-breaking
  #     * spaces.
  #     
  tabToSpacesCount: Control.property.integer((count) ->
    # a run of <count> spaces
    spaces = (if count then Array(count + 1).join("&nbsp;") else null)
    @_spacesForTab spaces
  )

