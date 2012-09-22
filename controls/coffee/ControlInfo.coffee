###
Utility functions for analyzing the documentation of a control.

While all this information could be reconstructed by examining the complete set
of loaded QuickUI controls, that would require instantiating at least one
instance of each control class. For performance, then, these utility functions
rely on a database of information about a collection of controls (viz., the
QuickUI Catalog). This is constructed at design time by statically analyzing the
controls' source, then building a JSON database and exposing that as a
"controlDocumentation" global.
###

class window.ControlInfo

  constructor: ( @className ) ->
    @info = controlDocumentation[ @className ]

  baseClassName: ->
    @info?.baseClass ? "Control"

  ###
  Return any classes required by the given class.
  ###
  requiredClassNames: ->
    return ( requiredClassName for requiredClassName in @info?.requiredClasses )

  ###
  Return any documented subclasses defined for the given class.
  ###
  subclassNames: ->
    return ( subclassName for subclassName of controlDocumentation when controlDocumentation[ subclassName ]?.baseClass == @className )
