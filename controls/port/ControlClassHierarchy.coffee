###
Shows a single control's control class hierarchy.
###

class window.ControlClassHierarchy extends Control

  inherited:
    content: [
      control: "List"
      ref: "ControlClassHierarchy_baseClasses"
      itemClass: "CatalogLink"
    ]

  baseClasses: ( classFn ) ->
    classFn = classFn ? @describeClass()
    superclass = classFn.superclass
    if superclass is undefined or superclass is jQuery
      []
    else
      baseClasses = @baseClasses( superclass )
      baseClasses.unshift superclass
      baseClasses

  baseClassNames: Control.chain "$ControlClassHierarchy_baseClasses", "items"

  describeClass: Control.property.class ( describeClass ) ->
    baseClasses = @baseClasses()
    baseClassNames = $.map( baseClasses, ( classFn ) ->
      classFn::className
     )
    @baseClassNames baseClassNames
