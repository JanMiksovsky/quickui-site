###
The list of links down the left side of a Catalog page.
###

class window.CatalogNavigationLinks extends Control

  inherited:
    content: [
      control: "Link", href: "/catalog/", content: "Index"
    ,
      control: "Link", href: "/catalog/usingCatalog.html", content: "How to use the catalog"
    ,
      control: "List", ref: "listControls", itemClass: "CatalogLink"
    ]

  initialize: ->
    @$listControls().mapFunction ( controlRecord ) ->
      @content controlRecord.name
    @$listControls().items controlRecords
