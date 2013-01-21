###
Wrap a Share button from addthis.com 
###

class window.AddThis extends Control
  
  inherited:
    content: [
      """
      <div class=\"addthis_toolbox addthis_default_style\">
        <a href=\"http://www.addthis.com/bookmark.php?v=250&amp;pub=janmiksovsky\" class=\"addthis_button_compact\">Share</a>
        <span class=\"addthis_separator\">|</span>
        <a class=\"addthis_button_twitter\"></a>
        <a class=\"addthis_button_facebook\"></a>
        <a class=\"addthis_button_email\"></a>
        <a class=\"addthis_button_favorites\"></a>
        <a class=\"addthis_button_print\"></a>
      </div>
      """
    ]

addthis_share =
  content: "Hello, world!"
  templates:
    twitter: "QuickUI creates modular jQuery controls that can be used like new HTML tags {{url}}"
  title: "QuickUI"
  url: "http://quickui.org"
