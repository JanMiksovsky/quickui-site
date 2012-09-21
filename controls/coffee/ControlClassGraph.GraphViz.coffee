###
Show a class graph for a control class.
###

class window.ControlClassGraph extends GraphViz

  graphClass: Control.property.class ( graphClass ) ->
    classNode = @_classNode graphClass
    baseClassEdges = @_baseClassEdges graphClass
    subclassEdges = @_subclassEdges graphClass
    requiredClassEdges = @_requiredClassEdges graphClass
    dot = """
      digraph {
        rankdir=BT;
        node [shape=box];
        #{classNode}
        #{baseClassEdges}
        #{subclassEdges}
        #{requiredClassEdges}
      }
    """
    @dot dot

  _classEdge: ( classFn, baseClass ) ->
    "  #{classFn::className} -> #{baseClass::className};\n"

  _baseClassEdges: ( classFn ) ->
    edges = ""
    if classFn isnt Control
      baseClass = classFn.superclass
      if baseClass?
        edges += @_classEdge classFn, baseClass
        edges += @_baseClassEdges baseClass
    edges

  _classNode: ( classFn ) ->
    "  #{classFn::className} [penwidth=2.0];\n"

  _requiredClassEdges: ( classFn ) ->
    controlInfo = new ControlInfo classFn
    edges = ""
    for requiredClass in controlInfo.requiredClasses()
      edges += @_classEdge classFn, requiredClass
    edges    

  _subclassEdges: ( classFn ) ->
    controlInfo = new ControlInfo classFn
    edges = ""
    for subclass in controlInfo.subclasses()
      edges += @_classEdge subclass, classFn
    edges