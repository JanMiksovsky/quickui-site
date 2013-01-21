###
Main site template for quickui.org.
###

class window.SitePage extends PageWithQuadrants

  inherited:
    topLeft: [
      control: "Logo"
    ]
    topRight: [
      control: "NavigationBar"
    ]
    bottomLeft: [
      "<h1> </h1>" # Won't actually appear, just used for space 
    ,  
      control: "NavigationLinks", ref: "SitePage_navigationLinks"
    ]
    bottomRight: [
      html: "<h1/>", ref: "SitePage_title"
    , 
      html: "<div/>", ref: "SitePage_content"
    , 
      control: "GoogleAnalytics", profileId: "UA-11520232-1"
    ]

  content: Control.chain "$SitePage_content", "content"
  
  navigationLinks: Control.chain "$SitePage_navigationLinks", "content"

  title: ( value ) ->
    if value is undefined
      super()
    else
      @$SitePage_title().content value
      super "#{value} - QuickUI"
