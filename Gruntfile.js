'use strict';

var local = require('./build/local.json');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-phonegap-build');
    grunt.loadNpmTasks('grunt-sass');

    var debug = typeof grunt.option('release') === "undefined";

    grunt.registerTask('check', ['jshint']);

    grunt.registerTask('js', debug ? ['browserify'] : ['browserify', 'uglify']);
    grunt.registerTask('css', debug ? ['sass', 'concat'] : ['sass', 'concat', 'cssmin']);
    grunt.registerTask('app', ['clean', 'js', 'css', 'copy']);

    grunt.registerTask('phonegap', ['compress', 'phonegap-build']);

    grunt.registerTask('default', ['app', 'phonegap']);

    var srcDir  = 'src/',
        tempDir = 'build/temp/',
        distDir = 'dist/',
        jsDir   = srcDir + 'js/', 
        sassDir = srcDir + 'sass/',
        jsBundlePath     = distDir + 'bundle.js',
        jsMinBundlePath  = distDir + 'bundle.min.js',
        cssBundlePath    = distDir + 'bundle.css',
        cssVendorPath    = distDir + 'vendor.css',
        cssMinBundlePath = distDir + 'bundle.min.css',
        zipFilePath = tempDir + 'app.zip';

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            app: ['Gruntfile.js', jsDir + '*.js']
        },

        clean: [
            tempDir + '**/*',
            distDir + '**/*'
        ],

        browserify: {
            app: {
                options: {
                    alias: [jsDir + 'app.js:app'],
                    transform: ['browserify-shim'],
                    bundleOptions: {
                        debug: debug  // Create source maps in debug mode
                    }
                },
                src: [],  // Includes everything in "alias", plus their (recursive) dependencies
                dest: jsBundlePath
            }
        },

        uglify: {
            app: {
                src: [jsBundlePath],
                dest: jsMinBundlePath
            }
        },

        sass: {
            app: {
                src: [sassDir + 'main.scss'],
                dest: cssBundlePath
            }
        },

        concat: {
            lib: {
                src: [
                ],
                dest: cssVendorPath
            }
        },

        cssmin: {
            app: {
                src: [cssBundlePath, cssVendorPath],
                dest: cssMinBundlePath
            }
        },

        copy: {
            app: {
                expand: true,
                cwd: 'src/',
                src: [
                    'config.xml',
                    'index.html',
                    'sass/lib/leaflet.css',
                    'sass/lib/fontello.css',
                    'sass/lib/bootstrap.min.css',
                    'sass/lib/bootstrap-dialog.min.css',
                    'sass/fonts/*',
                    'tiles/**/*',
                    'img/**/*',
                    'quests.json'
                ],
                dest: distDir
            }
        },

        compress: {
            options: { archive: zipFilePath },
            app: {
                expand: true,
                cwd: distDir,
                src: ["**/*"]
            }
        },

        "phonegap-build": {
            app: {
                options: {
                    archive: zipFilePath,
                    appId: local.appId,
                    user: { token: local.token },
                    pollRate: 3000,  // ms
                    download: { ios: tempDir + 'ios.ipa' }
                }
            }
        }
    });
};
