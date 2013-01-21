###
A link to a YouTube video.
###

class window.YouTubeVideo extends Control
  inherited:
    content: [" ",
      html: "<iframe title=\"YouTube video player\" width=\"640\" height=\"390\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\" />"
      ref: "iframe"
    , " "]

YouTubeVideo::extend videoId: Control.property((videoId) ->
  url = "http://www.youtube.com/embed/" + videoId
  @$iframe().attr "src", url
)
