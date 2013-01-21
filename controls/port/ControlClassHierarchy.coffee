ControlClassHierarchy = Control.sub(
  className: "ControlClassHierarchy"
  inherited:
    content: [" ",
      control: "List"
      ref: "ControlClassHierarchy_baseClasses"
      itemClass: "CatalogLink"
    , " "]
)
ControlClassHierarchy::extend
  baseClasses: (classFn) ->
    classFn = classFn or @describeClass()
    superclass = classFn.superclass
    if superclass is `undefined` or superclass is jQuery
      []
    else
      baseClasses = @baseClasses(superclass)
      baseClasses.unshift superclass
      baseClasses

  baseClassNames: Control.chain("$ControlClassHierarchy_baseClasses", "items")
  describeClass: Control.property["class"]((describeClass) ->
    baseClasses = @baseClasses()
    baseClassNames = $.map(baseClasses, (classFn) ->
      classFn::className
    )
    @baseClassNames baseClassNames
  )

