/* jshint node: true*/
/* global grunt */

/*
    * Options:
    * srcdir: Source directory.
*/

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('build', ['concat', 'jshint']);
    grunt.registerTask('test', ['concat'/*, 'jshint'*/]);
    grunt.registerTask('dev', ['test', 'watch']);
    grunt.registerTask('default', ['build']);
    
    var files = [
        'defines',
        'util',
        'bot',
        'scripts'
    ];

    var srcDir = grunt.option('srcdir') || 'src/';
    files = files.map(function (file) {
        return srcDir + file + '.js';
    });
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: grunt.file.read(srcDir + 'banner.jst'),
                process: function(src, filepath) {
                    return '// Source: https://github.com/TheUnknownOne/PO-Server-Tools/blob/master/' + filepath + '\n' + grunt.template.process(src);
                },
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