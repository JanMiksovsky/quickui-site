Popout = Control.sub(className: "Popout")
Popout::extend initialize: ->
  self = this
  @hover (hoverIn = ->
    self.addClass "hovered"
  ), hoverOut = ->
    self.removeClass "hovered"


