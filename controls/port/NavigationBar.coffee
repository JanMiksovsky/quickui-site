###
The quickui.org navigation bar.
###

class window.NavigationBar extends Control

  inherited:
    content: [
      control: "Link", href: "/", content: "Home"
    , 
      control: "Link", linksToArea: "true", href: "/tutorial/", content: "Tutorial"
    , 
      control: "Link", linksToArea: "true", href: "/docs/", content: "Docs"
    , 
      control: "Link", linksToArea: "true", href: "/catalog/", content: "Catalog"
    
    # Hide markup-based screencasts until they can be re-done for JS.
    # <Link href="/screencasts">Screencasts</Link>
    ,  
      control: "Link", href: "http://blog.quickui.org", content: "Blog"
    
    # Hide for now, since this isn't getting any use.
    # <Link href="http://discussions.zoho.com/quickui">Discuss</Link>
    ,  
      control: "Link", href: "https://github.com/JanMiksovsky/quickui", content: "Source Code"
    , 
      control: "SearchBox", ref: "searchBox"
    ]
