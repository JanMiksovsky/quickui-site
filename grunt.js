// Build tests.

module.exports = function(grunt) {

    grunt.loadTasks( "../quickui/grunt" );

    // Project configuration.
    grunt.initConfig({
        coffee: {
            snippets: {
                src: "docs/snippets/*.coffee",
                dest: "docs/snippets/snippets.js"
            }
        },
        watch: {
            coffee: {
                files: "<config:coffee.snippets.src>",
                tasks: "coffee:snippets"
            }
        }
    });

    // Default task.
    grunt.registerTask( "default", "coffee" );
    
};
