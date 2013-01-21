###
Render a graph with the GraphViz DOT algorithm.
This currently uses the (deprecated) Google Image Charts renderer.
###

class window.GraphViz extends Control

  dot: Control.property ( dot ) ->
    @prop "src", "https://chart.googleapis.com/chart?cht=gv&chl=#{dot}"

  tag: "img"