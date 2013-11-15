/* jshint node: true*/
/* global grunt */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build', ['concat', 'jshint']);
    grunt.registerTask('fulltest', ['concat', 'jshint']);
    grunt.registerTask('test', ['concat', 'jshint:scripts']);
    grunt.registerTask('dev', ['test', 'watch']);
    grunt.registerTask('default', ['concat', 'jshint:scripts']);
    
    var files = [
        // Global definitions
        'defines',
        // JSESSION & Factories
        'jsession',
        'factory/user',
        'factory/channel',
        //'factory/global',
        // Utilities
        'util/util',
        'util/player-util',
        'util/mod-util',
        // Bot & Messages
        'bot',
        // Tours
        'tours/defines',
        // Events
        'scripts'
    ];

    var srcDir = 'src/';
    files = files.map(function (file) {
        return srcDir + file + '.js';
    });
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: grunt.file.read(srcDir + 'banner.jst'),
                process: function(src, filepath) {
                    return grunt.template.process('/*! Source: <%= pkg.script.sourceurl %>' + filepath + ' */\n' + src);
                },
                stripBanners: true
            },
            scripts: {
                files: [
                    {src: files, dest: 'scripts.js'}
                ]
            }
        },
        watch: {
            files: srcDir + '**/*.js',
            tasks: ['test']
        },
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            scripts: ['scripts.js'],
            src: ['src/**/*.js']
        }
    });
};