###
Show the contents of a source code file.
The code is colorized via the SourceCode control, and a link to the original
file is provided.
###

class window.SourceFileContents extends Control
  inherited:
    content: [" ",
      control: "SourceCode"
      ref: "SourceFileContents_content"
    , " ",
      html: "<div />"
      ref: "linkContainer"
      content: [" ",
        html: "<a />"
        ref: "link"
        content: ["→ ",
          html: "<span />"
          ref: "linkText"
        ]
      , " "]
    , " "]

  content: Control.chain("$SourceFileContents_content", "content")
  path: Control.property((path) ->
    
    # Load the file's contents.
    self = this
    $.get(path).success (data) ->
      self.content data

    # Show the path to the file.
    if path isnt `undefined`
      @$link().attr "href", path
      pathNames = (if path then path.split("/") else null)
      fileName = (if (pathNames and pathNames.length > 0) then pathNames[pathNames.length - 1] else null)
      @$linkText().html fileName
  )

