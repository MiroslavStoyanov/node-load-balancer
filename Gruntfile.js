module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            target: ['src/**/*.ts', 'examples/**/*.ts'],
        },
        watch: {
            scripts: {
                files: ['src/**/*.ts', 'examples/**/*.ts'],
                tasks: ['eslint'],
            },
        },
        shell: {
            startRoundRobinExample: {
                command: 'node dist/examples/roundRobin/example.js',
            },
            startWeightedRoundRobinExample: {
                command: 'node dist/examples/weightedRoundRobin/example.js',
            },
            startIPHashExample: {
                command: 'node dist/examples/ipHash/example.js'
            }
            // Add more example tasks here as needed
        },
    });

    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default', ['eslint']);
};
