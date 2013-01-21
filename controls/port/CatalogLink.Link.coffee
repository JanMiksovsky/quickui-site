###
A link to a Catalog page.
###

class window.CatalogLink extends Link
  inherited: {}

CatalogLink::extend content: (content) ->
  @href href = "/catalog/" + content + "/"  if content isnt `undefined`
  @_super content

