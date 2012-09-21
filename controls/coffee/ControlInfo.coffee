###
Utility functions for analyzing the documentation of a control.
This relies on a controlDocumentation global, which is constructed by statically
analyzing the source of a collection of controls (viz., the QuickUI Catalog).
###

class ControlInfo

  constructor: ( @controlClass ) ->

  baseClassName: ->
    controlDocumentation[ @className() ]?.baseClass ? "Control"

  className: ->
    @controlClass::className

  ###
  Return any documented subclasses defined for the given class.
  ###
  subclasses: ->
    className = @className()
    return ( window[ subclassName ] for subclassName of controlDocumentation when controlDocumentation[ subclassName ]?.baseClass == className )
