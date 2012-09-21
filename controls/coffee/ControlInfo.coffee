###
Utility functions for analyzing the documentation of a control.
This relies on a controlDocumentation global, which is constructed by statically
analyzing the source of a collection of controls (viz., the QuickUI Catalog).
###

class window.ControlInfo

  # TODO: use class name, not class, to avoid needing to instantiate everything
  constructor: ( @controlClass ) ->

  baseClassName: ->
    controlDocumentation[ @className() ]?.baseClass ? "Control"

  className: ->
    @controlClass::className

  ###
  Return any classes required by the given class.
  ###
  requiredClasses: ->
    return ( window[ requiredClassName ] for requiredClassName in controlDocumentation[ @className() ]?.requiredClasses )

  ###
  Return any documented subclasses defined for the given class.
  ###
  subclasses: ->
    className = @className()
    return ( window[ subclassName ] for subclassName of controlDocumentation when controlDocumentation[ subclassName ]?.baseClass == className )
