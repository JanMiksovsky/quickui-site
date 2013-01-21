###
A link to a screencast.
###

class window.ScreencastLink extends Control
  inherited:
    content: [" ",
      html: "<img src=\"/resources/play.png\" />"
      ref: "iconPlay"
    , " ",
      control: "Link"
      ref: "ScreencastLink_content"
    , " "]

  content: Control.chain("$ScreencastLink_content", "content")
  href: Control.chain("$ScreencastLink_content", "href")
  initialize: ->
    self = this
    @$iconPlay().click ->
      self.$ScreencastLink_content().trigger "click"

