###
Show a class graph for a control class.
###

class window.ControlClassGraph extends GraphViz

  graphClass: Control.property.class ( graphClass ) ->
    controlInfo = new ControlInfo graphClass::className
    classNode = @_classNode controlInfo
    baseClassEdges = @_baseClassEdges controlInfo, "[color=black]", "[color=black]"
    subclassEdges = @_subclassEdges controlInfo
    requiredClassEdges = @_requiredClassEdges controlInfo
    dot = "digraph{rankdir=BT;node[color=gray;shape=box;fontsize=10.0];edge[color=gray];#{classNode}#{baseClassEdges}#{subclassEdges}#{requiredClassEdges}}"
    @dot dot

  _baseClassEdge: ( className, baseClassName, nodeStyle, edgeStyle ) ->
    edge = "#{className}->#{baseClassName}#{edgeStyle};"
    if nodeStyle
      edge += "#{baseClassName}#{nodeStyle};"
    edge

  _baseClassEdges: ( controlInfo, nodeStyle, edgeStyle ) ->
    edges = ""
    baseClassName = controlInfo.baseClassName()
    edges += @_baseClassEdge controlInfo.className, baseClassName, nodeStyle, edgeStyle
    if baseClassName != "Control"
      baseClassInfo = new ControlInfo baseClassName
      edges += @_baseClassEdges baseClassInfo, nodeStyle, edgeStyle
      edges += @_requiredClassEdges baseClassInfo
    edges

  _classNode: ( controlInfo ) ->
    "#{controlInfo.className}[color=black;penwidth=2.0];"

  _requiredClassEdge: ( className, requiredClassName ) ->
    "#{className}->#{requiredClassName};"

  _requiredClassEdges: ( controlInfo ) ->
    edges = ""
    for requiredClassName in controlInfo.requiredClassNames()
      edges += @_requiredClassEdge controlInfo.className, requiredClassName
      requiredClassInfo = new ControlInfo requiredClassName
      edges += @_baseClassEdges requiredClassInfo
      edges += @_requiredClassEdges requiredClassInfo
    edges

  _subclassEdges: ( controlInfo ) ->
    edges = ""
    for subclassName in controlInfo.subclassNames()
      edges += @_baseClassEdge subclassName, controlInfo.className
    edges