// Build tests.

module.exports = function(grunt) {

    grunt.loadTasks( "../quickui/grunt" );
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadTasks( "grunt" );

    var sortDependencies = require( "../quickui/grunt/sortDependencies.js" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortClassFiles( "controls/coffee/*.coffee" ),
                dest: "controls/coffee/coffee.js"
            },
            samples: {
                src: [ "docs/samples/*.coffee",
                ],
                dest: "docs/samples/samples.coffee.js"
            }
        },
        concat: {
            controlsJs: {
                src: [
                    "controls/markup/markup.js",
                    "controls/coffee/coffee.js"
                ],
                dest: "controls/controls.js"
            },
            controlsCss: {
                src: [
                    "controls/markup/markup.css",
                    "controls/coffee/coffee.css"
                ],
                dest: "controls/controls.css"
            },
            samples: {
                src: [
                    "docs/samples/SiteTemplate.js",
                    "docs/samples/ProductTemplate.js",
                    "docs/samples/HomePage.js",
                    "docs/samples/SimplePage.js",
                    "docs/samples/SampleProductPage.js"
                ],
                dest: "docs/samples/samples.js"                                
            }
        },
        less: {
            controls: {
                files: {
                    "controls/coffee/coffee.css": sortDependencies.sortClassFiles( "controls/coffee/*.less" )
                }
            }
        },
        qb: {
            controls: {
                path: "controls/markup"
            },
            markup: {
                path: "markup"
            }
        },
        watch: {
            coffee: {
                files: "<config:coffee.samples.src>",
                tasks: "coffee:samples"
            },
            concat: {
                files: "<config:concat.samples.src>",
                tasks: "concat:samples"
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee less qb concat" );
    
};
