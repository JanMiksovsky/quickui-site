// Build tests.

module.exports = function(grunt) {

    grunt.loadTasks( "../../../quickui/plugins/grunt" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            controls: {
                src: "*.coffee",
                dest: "snippets.js"
            }
        },
        watch: {
            coffee: {
                files: "<config:coffee.controls.src>",
                tasks: "coffee"
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee" );
    
};
