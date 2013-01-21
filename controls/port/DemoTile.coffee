###
A demo for a single control, shown as a tile.
###

class window.DemoTile extends Control
  inherited:
    content: [" ",
      html: "<div />"
      ref: "classNameContainer"
      content: [" ",
        control: "CatalogLink"
        ref: "className"
      , " "]
    , " ",
      html: "<p />"
      ref: "description"
    , " ",
      control: "Demo"
      ref: "demoContainer"
    , " "]

DemoTile::extend controlRecord: Control.property((controlRecord) ->
  className = controlRecord.name
  @$className().content className
  demoFunctionName = controlRecord.demoFunction
  # Default demo function name for class Foo is demoFoo.
  demoFunctionName = "demo" + className  if demoFunctionName is `undefined`
  if demoFunctionName
    demoFunction = window[demoFunctionName]
    if demoFunction
      # Run the demo within the context of this tile.
      window.$demo = @$demoContainer()
      demoFunction()
  @$description().content controlRecord.description
)
