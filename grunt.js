// Build tests.

module.exports = function(grunt) {

    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-less" );
    grunt.loadNpmTasks( "quickui-markup" );

    var sortDependencies = require( "sort-dependencies" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortFiles( "controls/coffee/*.coffee" ),
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
                    "controls/coffee/coffee.css": sortDependencies.sortFiles( "controls/coffee/*.less" )
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
