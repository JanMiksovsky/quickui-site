// Build tests.

module.exports = function(grunt) {

    grunt.loadTasks( "../quickui/grunt" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            samples: {
                src: [ "docs/samples/*.coffee",
                ],
                dest: "docs/samples/samples.coffee.js"
            }
        },
        concat: {
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
    grunt.registerTask( "default", "coffee concat watch" );
    
};
