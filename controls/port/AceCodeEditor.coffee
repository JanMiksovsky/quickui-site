###
Ace code editor wrapper.
Must set an ID on a control instance for this to work!
###

class window.AceCodeEditor extends Control

  content: ( content ) ->
    editor = @_editor()
    if content is undefined
      if editor
        editor.getSession().getValue()
      else
        @_content()
    else
      if editor
        editor.getSession().setValue content
      else
        @_content content
      @

  initialize: ->
    @inDocument ->
      content = @content()
      id = @prop "id" 
      editor = ace.edit id
      @_editor editor
      session = editor.getSession()
      session.setUseSoftTabs true
      editor.setShowPrintMargin false
      editor.renderer.setShowGutter false
      editor.renderer.setHScrollBarAlwaysVisible false
      JavaScriptMode = require( "ace/mode/javascript" ).Mode
      session.setMode new JavaScriptMode()
      @content content

  # Copy of the content, used to save content until editor is ready.
  _content: Control.property()
  
  _editor: Control.property()
