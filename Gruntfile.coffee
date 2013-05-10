###
Build QuickUI site
###

module.exports = (grunt) ->

  @loadNpmTasks "grunt-contrib-coffee"
  @loadNpmTasks "grunt-contrib-concat"
  @loadNpmTasks "grunt-contrib-less"
  sortDependencies = require "sort-dependencies"
  
  # Project configuration.
  @initConfig
    coffee:
      controls:
        src: sortDependencies.sortFiles "controls/*.coffee"
        dest: "controls/controls.js"
      samples:
        src: ["docs/samples/*.coffee"]
        dest: "docs/samples/samples.coffee.js"
    concat:
      samples:
        src: [
          "docs/samples/SiteTemplate.js"
          "docs/samples/ProductTemplate.js"
          "docs/samples/HomePage.js"
          "docs/samples/SimplePage.js"
          "docs/samples/SampleProductPage.js"
        ]
        dest: "docs/samples/samples.js"
    less:
      controls:
        files:
          "controls/controls.css": sortDependencies.sortFiles "controls/*.less"

  # Default task.
  @registerTask "default", [ "coffee", "less", "concat" ]
