###
A page in the Documentation area.
###

class window.DocumentationPage extends SitePage
  inherited:
    navigationLinks: [" ",
      control: "Link"
      ref: "linkIndex"
      href: "/docs/"
      content: "Index"
    , " ",
      control: "Link"
      href: "principles.html"
      content: "Core principles"
    
    # <Link href="framework.html">Framework overview</Link> 
    , " ", " ",
      control: "Link"
      href: "control-plugin.html"
      content: "$.control() plugin"
    , " ",
      control: "Link"
      href: "control-class-methods.html"
      content: "Class methods"
    , " ",
      control: "Link"
      href: "control-prototype-methods.html"
      content: "Prototype methods"
    , " ",
      control: "Link"
      href: "control-events.html"
      content: "Events"
    , " ",
      control: "Link"
      href: "rendering.html"
      content: "Rendering"
    , " ",
      control: "Link"
      href: "control-JSON.html"
      content: "Control JSON"
    , " ",
      control: "Link"
      href: "CoffeeScript.html"
      content: "CoffeeScript"
    , " ",
      control: "Link"
      href: "contacts.html"
      content: "Contacts sample app"
    , " ",
      control: "Link"
      href: "control-guidelines.html"
      content: "Guidelines"
    , " "]

