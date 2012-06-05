# Define button class
class window.IconButton extends BasicButton
  inherited:
    content: [
      "<img src='http://quickui.org/demos/resources/document_alt_stroke_12x16.png'/> "
      { html: "span", ref: "IconButton_content" }
    ]
  content: Control.chain "$IconButton_content", "content"
  
# Create some buttons
$ -> $( "#demo" ).append(
  IconButton.create "Document 1"
  " "
  IconButton.create "Document 2"
)
