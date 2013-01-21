CatalogLink = Link.sub(
  className: "CatalogLink"
  inherited: {}
)
CatalogLink::extend content: (content) ->
  @href href = "/catalog/" + content + "/"  if content isnt `undefined`
  @_super content

