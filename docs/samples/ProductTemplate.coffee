class window.ProductTemplate extends SiteTemplate
  
  constructor: -> return Control.coffee()
  
  inherited:
    top: [
      "Products > "
      { html: "span", ref: "ProductTemplate_description" }
    ]
    content: [
      { control: BasicButton, content: "Buy Now", css: float: "right" }
      { html: "div", ref: "ProductTemplate_content" }
    ]
    
  content: Control.chain "$ProductTemplate_content", "content"
  description: Control.chain "$ProductTemplate_description", "content"
