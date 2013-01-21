###
Show a class graph for a control class.
###

class window.ControlClassGraph extends GraphViz

  graphClass: Control.property.class ( graphClass ) ->
    controlInfo = new ControlInfo graphClass::className
    classNode = @_classNode controlInfo
    baseClassEdges = @_baseClassEdges controlInfo, "[color=black fontcolor=black]", "[color=black]"
    subclassEdges = @_subclassEdges controlInfo
    requiredClassEdges = @_requiredClassEdges controlInfo
    dot = "digraph{rankdir=BT;node[color=gray fontcolor=gray40 fontsize=10.0 shape=box];edge[arrowsize=0.75 color=gray50];#{classNode}#{baseClassEdges}#{subclassEdges}#{requiredClassEdges}}"
    @dot dot

  _baseClassEdge: ( className, baseClassName, nodeStyle, edgeStyle ) ->
    edgeStyle = edgeStyle ? ""
    edge = "#{className}->#{baseClassName}#{edgeStyle};"
    if nodeStyle
      edge += "#{baseClassName}#{nodeStyle};"
    edge

  _baseClassEdges: ( controlInfo, nodeStyle, edgeStyle ) ->
    edges = ""
    baseClassName = controlInfo.baseClassName()
    if baseClassName != "Control"
      edges += @_baseClassEdge controlInfo.className, baseClassName, nodeStyle, edgeStyle
      baseClassInfo = new ControlInfo baseClassName
      edges += @_baseClassEdges baseClassInfo, nodeStyle, edgeStyle
      edges += @_requiredClassEdges baseClassInfo
    edges

  _classNode: ( controlInfo ) ->
    "#{controlInfo.className}[color=black fontcolor=black penwidth=2.0];"

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