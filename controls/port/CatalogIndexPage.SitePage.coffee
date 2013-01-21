###
Top page for the Catalog area.
###

class window.CatalogIndexPage extends SitePage

  inherited:
    title: "QuickUI Catalog"
    navigationLinks: [
      control: "CatalogNavigationLinks"
    ]
    content: [
      html: "<p/>"
      ref: "intro"
      content: [
        " These are open, ready-to-use controls, including base classes and samples. "
      ,
        control: "Link", href: "usingCatalog.html", content: "How to use these"
      ]
    ,
      control: "List"
      ref: "tileList"
      itemClass: "DemoTile"
      mapFunction: "controlRecord"
    ]

  controlRecords: Control.chain "$tileList", "items"
