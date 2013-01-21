###
A page in the Tutorial area.
###

class window.TutorialPage extends SitePage
  inherited:
    navigationLinks: [" ",
      control: "Link"
      href: "/tutorial/"
      content: "Introduction"
    , " ", "<h2>Using controls</h2>", " ",
      control: "Link"
      href: "/tutorial/context-independent.html"
      content: "Context independence"
    , " ",
      control: "Link"
      href: "/tutorial/defined-by-classes.html"
      content: "Control classes"
    , " ",
      control: "Link"
      href: "/tutorial/controls-are-composable.html"
      content: "Controls are composable"
    , " ",
      control: "Link"
      href: "/tutorial/inherit-from-jQuery.html"
      content: "Inheriting from jQuery"
    , " ",
      control: "Link"
      href: "/tutorial/content.html"
      content: "Control content"
    , " ",
      control: "Link"
      href: "/tutorial/properties.html"
      content: "Control properties"
    , " ",
      control: "Link"
      href: "/tutorial/casting.html"
      content: "Casting jQuery objects"
    , " ",
      control: "Link"
      href: "/tutorial/controls-from-elements.html"
      content: "Using existing elements"
    , " ",
      control: "Link"
      href: "/tutorial/css-classes.html"
      content: "CSS class names"
    , " ",
      control: "Link"
      href: "/tutorial/manipulating-arrays.html"
      content: "Control arrays"
    , " ",
      control: "Link"
      href: "/tutorial/event-handlers.html"
      content: "Handling events"
    , " ",
      control: "Link"
      href: "/tutorial/meta-controls.html"
      content: "Meta-controls"
    , " ", "<h2>Designing controls</h2>", " ",
      control: "Link"
      href: "/tutorial/creating-control-class.html"
      content: "Creating a new class"
    , " ",
      control: "Link"
      href: "/tutorial/json-content.html"
      content: "Setting default content"
    , " ",
      control: "Link"
      href: "/tutorial/extending-control-prototype.html"
      content: "Adding functionality"
    , " ",
      control: "Link"
      href: "/tutorial/element-reference-functions.html"
      content: "Referencing elements"
    , " ",
      control: "Link"
      href: "/tutorial/defining-properties.html"
      content: "Exposing properties"
    , " ",
      control: "Link"
      href: "/tutorial/handling-content.html"
      content: "Properties handling content"
    , " ",
      control: "Link"
      href: "/tutorial/control-chain-helper.html"
      content: "Concise property definition"
    , " ",
      control: "Link"
      href: "/tutorial/subclassing-other-classes.html"
      content: "Subclassing other classes"
    , " ",
      control: "Link"
      href: "/tutorial/overriding-content-property.html"
      content: "Custom content properties"
    , " ",
      control: "Link"
      href: "/tutorial/initialize.html"
      content: "Initialization"
    , " ",
      control: "Link"
      href: "/tutorial/control-property-helper.html"
      content: "Property storage"
    , " ", "<h2>Advanced topics</h2>", " ",
      control: "Link"
      href: "/tutorial/jQuery-UI.html"
      content: "QuickUI + jQuery UI"
    , " ",
      control: "Link"
      href: "/tutorial/rehydration.html"
      content: "Controls in static HTML"
    , " ",
      control: "Link"
      href: "/tutorial/inDocument.html"
      content: "Waiting to be in the DOM"
    , " ", "<h2>Conclusion</h2>", " ",
      control: "Link"
      href: "/tutorial/using-QuickUI.html"
      content: "QuickUI in your projects"
    , " "]
    content: [" ", " ",
      html: "<div />"
      ref: "TutorialPage_content"
    , " ",
      control: "CodeEditor"
      ref: "editor"
    , " ",
      control: "BasicButton"
      ref: "buttonNext"
      class: "prominent"
      content: "Next »"
    , " "]

  content: Control.chain("$TutorialPage_content", "content")
  initialize: ->
    self = this
    @$buttonNext().click ->
      nextPage = self.nextPage()
      window.location = nextPage  if nextPage

    @$editor().code @_demo()

  nextPage: Control.property((nextPage) ->
    @$buttonNext().css "display", (if nextPage then "inline-block" else "none")
  )
  editorVisible: Control.chain("$editor", "visibility")
  
  # Return the code from the page's script tag.
  _demo: ->
    code = $.trim($("script#demo").html())
    if code.length > 0
      
      # Remove the first and last lines: the demo function wrapper.
      lines = code.split("\n")
      lines = lines.slice(1, lines.length - 2)
      code = $.trim(lines.join("\n"))
    code

