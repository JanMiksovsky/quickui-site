// Build tests.

module.exports = function(grunt) {

    grunt.loadNpmTasks( "grunt-contrib-coffee" );
    grunt.loadNpmTasks( "grunt-contrib-less" );

    var sortDependencies = require( "sort-dependencies" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: sortDependencies.sortFiles( "controls/coffee/*.coffee" ),
                dest: "controls/coffee/coffee.js"
            },
            port: {
                src: sortDependencies.sortFiles( "controls/port/*.coffee" ),
                dest: "controls/port/port.js"
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
                    "controls/port/port.js",
                    "controls/coffee/coffee.js"
                ],
                dest: "controls/controls.js"
            },
            controlsCss: {
                src: [
                    "controls/port/port.css",
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
            },
            port: {
                files: {
                    "controls/port/port.css": sortDependencies.sortFiles( "controls/port/*.less" )
                }
            },
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee less concat" );
    
};
