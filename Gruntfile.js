/* jshint node: true*/
/* global grunt */

// To test, you will need a 'server' directory (npm run-script test-win)
// with Server.exe in it (and its deps, of course).
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('copyscripts', function () {
        grunt.file.copy('scripts.js', 'server/scripts.js');
    });
    grunt.registerTask('bump-build', function () {
        var pkg = grunt.file.readJSON('package.json');
        if (!pkg.script.build) {
            pkg.script.build = 0;
        }
        pkg.script.build += 1;
        
        grunt.config.set('pkg', pkg);
        grunt.config.set('script', pkg.script);
        grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
    });
    
    grunt.registerTask('build', ['bump-build', 'concat']);
    grunt.registerTask('fulltest', ['build', 'jshint']);
    grunt.registerTask('test', ['build', 'copyscripts']);
    grunt.registerTask('dev', ['test', 'watch']);
    grunt.registerTask('default', ['build', 'jshint:scripts']);
    
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
        // Command stuff
        'commands/handle',
        // Style
        'style/style',
        'style/template',
        // Commands [last, before events]
        'commands/user/*',
        // Events
        'scripts'
    ];

    var srcDir = 'src/';
    files = files.map(function (file) {
        return srcDir + file + '.js';
    });
    
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: pkg,
        script: pkg.script,
        concat: {
            options: {
                banner: grunt.file.read(srcDir + 'banner.jst'),
                process: function(src, filepath) {
                    return grunt.template.process('/*! Source: <%= script.sourceurl %>' + filepath + ' */\n' + src);
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