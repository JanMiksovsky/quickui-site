###
A page in the QuickUI Catalog. 
###

class window.CatalogPage extends SitePage

  inherited:
    navigationLinks: [
      control: "CatalogNavigationLinks"
    ]
    content: [
      html: "<div class=\"section\"/>", ref: "CatalogPage_summary"
    , 
      control: "CodeEditor", ref: "editor", heading: "Live demo"
    , 
      html: "<div class=\"section\"/>", ref: "sectionBaseClasses", content: [
        """
          <h2>Class relationships</h2>
          <p>
            This shows the control's base classes (in black), other classes
            used by the control, and any subclasses.
          </p>
        """
      ,
        control: "ControlClassGraph", ref: "controlClassGraph"
      ]
    , 
      html: "<div class=\"section\"/>", ref: "sectionMembers", content: [
        "<h2>Class members</h2>"
      ,
        control: "ControlMemberTable", ref: "controlMemberTable"
      ]
    , 
      html: "<div class=\"section\"/>", ref: "sectionContent", content: [
        "<h2>Notes</h2>"
      , 
        html: "<div/>", ref: "CatalogPage_content"
      ]
    , 
      html: "<div class=\"section\"/>", ref: "sectionSource", content: [
        html: "<p/>", content: [
          " View the "
        ,
          control: "Link", ref: "linkSourceCodeControl"
        ,
          " on GitHub. "
        ]
      ]
    ]

  autoRun: Control.chain "$editor", "autoRun"

  content: Control.chain( "$CatalogPage_content", "content", ( content ) ->
    @$sectionContent().toggle content?
  )
  
  describeClass: Control.property.class ( describeClass ) ->

    @$controlClassGraph().graphClass describeClass

    # Instantiate class to force updating of class name.
    describeClass.create()

    className = describeClass::className
    @$controlMemberTable().describeClass className
    hasDocumentation = not $.isEmptyObject $( ".ControlMemberTable" ).control().content()
    @$sectionMembers().toggle hasDocumentation

    @_loadDemo className

    documentation = controlDocumentation[ className ]
    fileName = className
    if documentation?.baseClass?
      fileName += "." + documentation.baseClass
    fileName += ".coffee"
    link = @$linkSourceCodeControl()
    link.text "full source for #{className}"
    link.href "https://github.com/JanMiksovsky/quickui-catalog/blob/master/controls/#{fileName}"

  summary: Control.chain "$CatalogPage_summary", "content"

  title: ( title ) ->
    result = super title
    # Grab control class name from the title, use it to populate the fields with
    # standard values.
    if title isnt undefined
      @describeClass title
    result

  # Return the source code for the class' demo function. For class Foo, the
  # demo function should be called demoFoo. If not found, this returns null.
  _demoSource: ( className ) ->
    demoFunctionName = "demo" + className
    demoFunction = window[ demoFunctionName ]
    return null unless demoFunction?
    code = demoFunction.toString()
    if code.length > 0
      # Remove the the demo function wrapper, which should be the first and last
      # lines.
      lines = code.split "\n"
      lines = lines.slice 1, lines.length - 2
      code = $.trim lines.join "\n"
    code

  _loadDemo: ( className ) ->
    demoSource = @_demoSource className
    if demoSource?.length > 0
      @$editor().code demoSource
    else
      @$editor().hide()
