###
A link to a Catalog page.
###

class window.CatalogLink extends Link

  content: ( content ) ->
    if content?
      @href href = "/catalog/#{content}/"
    super content
