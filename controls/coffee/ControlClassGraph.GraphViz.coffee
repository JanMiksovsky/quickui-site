###
Show a class graph for a control class.
###

class window.ControlClassGraph extends GraphViz

  graphClass: Control.property.class ( graphClass ) ->
    controlInfo = new ControlInfo graphClass::className
    classNode = @_classNode controlInfo
    baseClassEdges = @_baseClassEdges controlInfo
    subclassEdges = @_subclassEdges controlInfo
    requiredClassEdges = @_requiredClassEdges controlInfo
    dot = """
      digraph {
        rankdir=BT;
        node [shape=box;fontsize=12.0];
        #{classNode}
        #{baseClassEdges}
        #{subclassEdges}
        #{requiredClassEdges}
      }
    """
    @dot dot

  _baseClassEdge: ( className, baseClassName ) ->
    "  #{className} -> #{baseClassName};\n"

  _baseClassEdges: ( controlInfo ) ->
    edges = ""
    baseClassName = controlInfo.baseClassName()
    edges += @_baseClassEdge controlInfo.className, baseClassName
    if baseClassName != "Control"
      edges += @_baseClassEdges new ControlInfo baseClassName
    edges

  _classNode: ( controlInfo ) ->
    "  #{controlInfo.className} [penwidth=2.0];\n"

  _requiredClassEdge: ( className, requiredClassName ) ->
    """
      #{className} -> #{requiredClassName} [color=gray];
      #{requiredClassName} [color=gray];
    """

  _requiredClassEdges: ( controlInfo ) ->
    edges = ""
    for requiredClassName in controlInfo.requiredClassNames()
      edges += @_requiredClassEdge controlInfo.className, requiredClassName
    edges

  _subclassEdges: ( controlInfo ) ->
    edges = ""
    for subclassName in controlInfo.subclassNames()
      edges += @_baseClassEdge subclassName, controlInfo.className
    edges