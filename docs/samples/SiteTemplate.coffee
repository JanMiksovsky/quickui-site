class window.SiteTemplate extends Page

  constructor: -> return Control.coffee()
  
  inherited:
    content: [
      { html: "h1", ref: "Page_top" }
      { html: "div", ref: "Page_content" }
    ]
    
  content: Control.chain "$Page_content", "content"
  top: Control.chain "$Page_top", "content"
  