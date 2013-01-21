###
Wraps the ACE code editor.
###

class window.CodeEditor extends Control

  inherited:
    content: [
      html: "<div/>", ref: "runner", content: [
        html: "<div class=\"labelRow\"/>", content: [
          html: "<div/>", content: [
            html: "<span>Edit JavaScript here</span>", ref: "CodeEditor_heading"
          ]
        , 
          html: "<div/>", content: [
            control: "BasicButton"
            ref: "buttonRun"
            class: "prominent"
            content: "▶ Run"
          ]
        ]
      , 
        html: "<div/>", content: [
          html: "<div/>", ref: "codePane", content: [ 
            # CodeEditor needs an ID on the control to work. 
            control: "AceCodeEditor", id: "editor", ref: "CodeEditor_code"
          ]
        , 
          control: "Demo", ref: "result"
        ]
      ]
    , 
      html: "<div/>", ref: "CodeEditor_error"
    ]

  # True if code should be run whenever it changes.
  autoRun: Control.property.bool null, true

  code: Control.chain "$CodeEditor_code", "content", ->
    if @inDocument() and @autoRun()
      @run()
    else
      @$result().content "( Click Run to see result. )"
  
  error: Control.chain "$CodeEditor_error", "content"

  heading: Control.chain "$CodeEditor_heading", "content"

  initialize: ->
    @$buttonRun().click => @run()
    @keydown ( event ) => @_keydown event
    @inDocument ->
      if @autoRun()
        @run()
      @$CodeEditor_code().focus()

  result: Control.chain "$result", "content"

  run: ->
    @error null
    @trigger "run"
    $demo = @$result()
    $demo.empty()
    code = @code()
    try
      eval code
    catch error
      @error error.toString()

  _insertTextAtCursor: ( text ) ->
    $editor = @$CodeEditor_code()
    position = $editor.cursorPosition()
    content = $editor.content()
    content = content.substr( 0, position ) + text + content.slice( position )
    $editor.content( content ).cursorPosition position + text.length

  _keydown: ( event ) ->
    if event.which is 13 and event.ctrlKey
      @run()
      event.stopPropagation true
      event.preventDefault()
      false
    else if event.which is 9
      event.stopPropagation()
      event.preventDefault()
      @_insertTextAtCursor "    "
      false

# Set/get the position of the cursor in an element ( namely, an input box or text
# area ). TODO: Fold into CodeEditor.
jQuery.fn.cursorPosition = ( position ) ->
  if position is undefined
    position = 0
    element = $( this ).get 0
    if not element
      position = -1
    else if document.selection
      element.focus()
      selection = document.selection.createRange()
      length = selection.text.length
      selection.moveStart "character", -element.value.length
      position = selection.text.length - length
    else if element.selectionStart
      # Firefox
      position = element.selectionStart
    position
  else
    @each ( index, element ) ->
      if element.createTextRange
        range = element.createTextRange()
        range.move "character", position
        range.select()
      else if element.setSelectionRange
        # Firefox
        element.focus()
        element.setSelectionRange position, position
