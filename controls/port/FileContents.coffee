###
Shows the contents of a file on the same domain.

Because of the same origin policy, it's not possible to get the contents of
a file on another domain.
###

class window.FileContents extends Control
  tag: "pre"

  content: Control.chain("text")
  
  # Path of the file whose contents should be shown. 
  path: Control.property((path) ->
    self = this
    $.get(path).success (data) ->
      self.content data

  )
