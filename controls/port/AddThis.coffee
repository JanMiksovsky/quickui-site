# Wrap a Share button from addthis.com 
AddThis = Control.sub(
  className: "AddThis"
  inherited:
    
    # AddThis Button BEGIN 
    
    # AddThis Button END 
    content: [" ", " ", "<div class=\"addthis_toolbox addthis_default_style\">\n    <a href=\"http://www.addthis.com/bookmark.php?v=250&amp;pub=janmiksovsky\" class=\"addthis_button_compact\">Share</a>\n    <span class=\"addthis_separator\">|</span>\n    <a class=\"addthis_button_twitter\"></a>\n    <a class=\"addthis_button_facebook\"></a>\n    <a class=\"addthis_button_email\"></a>\n    <a class=\"addthis_button_favorites\"></a>\n    <a class=\"addthis_button_print\"></a>\n    </div>", " ", " "]
)
addthis_share =
  content: "Hello, world!"
  templates:
    twitter: "QuickUI creates modular jQuery controls that can be used like new HTML tags {{url}}"

  title: "QuickUI"
  url: "http://quickui.org"
