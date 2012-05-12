class window.SiteTemplate extends Page

  constructor: -> return Control.coffee()
  
  inherited:
    content: [
      { html: "h1", ref: "Page_heading" }
      { html: "div", ref: "Page_content" }
    ]
    
  content: Control.chain "$Page_content", "content"
  heading: Control.chain "$Page_heading", "content"
  