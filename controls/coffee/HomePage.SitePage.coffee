###
quickui.org home page
###

class window.HomePage extends SitePage

  inherited:
    navigationLinks: [
      
      { html: "p", content: [
        { control: SampleSpriteButton, ref: "buttonTutorial", content: "Interactive Tutorial" }
      ]}

      "<h2>Download</h2>"
      { html: "div", content: [
        { control: Link, href: "/release/quickui-0.9.2.js", content: "quickui-0.9.2.js" }
      ]}

      "<h2 style='margin-top: 0;'>Recent news</h2>"
      { html: "div", content: [
        { control: "BlogHeadlines", feed: "http://blog.quickui.org/feed/", count: 3 }
      ]}
    
      # Hide while Control of the Week is on hiatus
      # "<h2>Control of the Week</h2>"
      # { html: "div", content: [
      #     { control: "BlogHeadlines", feed: "http://miksovsky.blogs.com/flowstate/controls/atom.xml", count: 1 }
      # ]}
    ]

  initialize: ->

    today = new Date()
    $( ".DateTextBox" ).control().date new Date today
    selectionStart = new Date today
    selectionEnd = new Date today
    selectionEnd.setDate selectionEnd.getDate() + 9
    $( ".DateRangeCalendar" ).control() \
      .selectionStart( selectionStart ) \
      .selectionEnd( selectionEnd )

    $( "#buttonTutorial" ).click =>
      window.location = "/tutorial/"
