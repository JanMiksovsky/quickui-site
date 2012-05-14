// Build tests.

module.exports = function(grunt) {

    grunt.loadTasks( "../quickui/grunt" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            samples: {
                src: [
                    "docs/samples/IconButton.coffee",
                    "docs/samples/SimplePage.coffee",
                    "docs/samples/SiteTemplate.coffee",
                    "docs/samples/ProductTemplate.coffee",
                    "docs/samples/SampleProductPage.coffee"
                ],
                dest: "docs/samples/samples.js"
            }
        },
        watch: {
            coffee: {
                files: "<config:coffee.samples.src>",
                tasks: "coffee:samples"
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee" );
    
};
