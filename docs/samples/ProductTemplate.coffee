class window.ProductTemplate extends SiteTemplate
  
  constructor: -> return Control.coffee()
  
  inherited:
    heading: [
      "Products > "
      { html: "span", ref: "ProductTemplate_heading" }
    ]
    content: [
      { control: BasicButton, content: "Buy Now", css: float: "right" }
      { html: "div", ref: "ProductTemplate_content" }
    ]
    
  content: Control.chain "$ProductTemplate_content", "content"
  heading: Control.chain "$ProductTemplate_heading", "content"
