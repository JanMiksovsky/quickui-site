# Google Analytics tracking code 
GoogleAnalytics = Control.sub(className: "GoogleAnalytics")
GoogleAnalytics::extend
  
  # The Google Analytics profile ID
  profileId: Control.property()
  initialize: ->
    
    # Begin Google Analytics snippet.
    _gaq = _gaq or []
    _gaq.push ["_setAccount", @profileId()]
    _gaq.push ["_trackPageview"]
    (->
      ga = document.createElement("script")
      ga.type = "text/javascript"
      ga.async = true
      ga.src = ((if "https:" is document.location.protocol then "https://ssl" else "http://www")) + ".google-analytics.com/ga.js"
      s = document.getElementsByTagName("script")[0]
      s.parentNode.insertBefore ga, s
    )()


# End Google Analytics snippet.
