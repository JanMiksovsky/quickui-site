CatalogNavigationLinks = Control.sub(
  className: "CatalogNavigationLinks"
  inherited:
    content: [" ",
      control: "Link"
      href: "/catalog/"
      content: "Index"
    , " ",
      control: "Link"
      href: "/catalog/usingCatalog.html"
      content: "How to use the catalog"
    , " ",
      control: "List"
      ref: "listControls"
      itemClass: "CatalogLink"
    , " "]
)
CatalogNavigationLinks::extend initialize: ->
  @$listControls().mapFunction((controlRecord) ->
    @content controlRecord.name
  ).items controlRecords

