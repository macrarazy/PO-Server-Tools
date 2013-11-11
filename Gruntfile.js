/* jshint node: true*/
/* global grunt */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build', ['concat', 'jshint']);
    grunt.registerTask('test', ['concat', 'jshint']);
    grunt.registerTask('dev', ['test', 'watch']);
    grunt.registerTask('default', ['build']);
    
    var files = [
        'defines',
        'jsession',
        'util',
        'bot',
        'factory/user',
        'factory/channel',
        //'factory/global',
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
            scripts: ['scripts.js']
        }
    });
};