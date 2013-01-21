SitePage = PageWithQuadrants.sub(
  className: "SitePage"
  inherited:
    topLeft: [" ",
      control: "Logo"
    , " "]
    topRight: [" ",
      control: "NavigationBar"
    , " "]
    
    # Won't actually appear, just used for space 
    bottomLeft: [" ", "<h1> </h1>", " ", " ",
      control: "NavigationLinks"
      ref: "SitePage_navigationLinks"
    , " "]
    bottomRight: [" ",
      html: "<h1 />"
      ref: "SitePage_title"
    , " ",
      html: "<div />"
      ref: "SitePage_content"
    , " ",
      control: "GoogleAnalytics"
      profileId: "UA-11520232-1"
    , " "]
)
SitePage::extend
  content: Control.chain("$SitePage_content", "content")
  navigationLinks: Control.chain("$SitePage_navigationLinks", "content")
  title: (value) ->
    if value is `undefined`
      @_super()
    else
      @$SitePage_title().content value
      @_super value + " - QuickUI"

