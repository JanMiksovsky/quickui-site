###
Show a class graph for a control class.
###

class window.ControlClassGraph extends GraphViz

  graphClass: Control.property.class ( graphClass ) ->
    className = graphClass::className
    documentation = controlDocumentation[ className ]
    baseClassName = documentation.baseClassName ? "Control"
    dot = """
      digraph {
        rankdir=BT;
        node [shape=box]
        #{className} -> #{baseClassName}
      }
    """
    @dot dot