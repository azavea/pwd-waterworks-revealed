'use strict';

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sass');

    var debug = typeof grunt.option('release') === "undefined";

    grunt.registerTask('check', ['jshint']);

    grunt.registerTask('js', debug ? ['browserify'] : ['browserify', 'uglify']);
    grunt.registerTask('css', debug ? ['sass', 'concat:lib'] : ['sass', 'concat:lib', 'cssmin']);
    grunt.registerTask('app', ['clean', 'quests', 'js', 'css', 'copy']);

    grunt.registerTask('default', ['app', 'compress']);

    grunt.registerTask('quests', function() {
        var exec = require('child_process').exec,
            done = this.async();

        exec('python scripts/assemble_quests.py', {},
            function(err) {
                if (err) {
                    grunt.log.error(err);
                    done(false);
                } else {
                    done(true);
                }
        });
    });

    var srcDir  = 'src/',
        tempDir = 'build/temp/',
        distDir = 'www/',
        zonesJson = srcDir + 'quests/**/*.json',
        jsDir   = srcDir + 'js/',
        sassDir = srcDir + 'sass/',
        jsBundlePath     = distDir + 'bundle.js',
        jsMinBundlePath  = distDir + 'bundle.min.js',
        cssBundlePath    = distDir + 'bundle.css',
        cssVendorPath    = distDir + 'vendor.css',
        cssMinBundlePath = distDir + 'bundle.min.css',
        zipFilePath = tempDir + 'app.zip',
        appAssets = [
            'config.xml',
            'index.html',
            'quests/**/*',
            'sass/lib/leaflet.css',
            'sass/lib/fontello.css',
            'sass/lib/bootstrap.min.css',
            'sass/lib/bootstrap-dialog.min.css',
            'sass/fonts/*',
            'tiles/**/*',
            'img/**/*',
            'quests.json'
        ];

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
                    transform: [
                        'browserify-shim',
                        ['jstify', { engine: 'lodash', noMinify: true }]
                    ],
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
                src: appAssets,
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

        watch: {
            options: {
                cwd: srcDir,
                livereload: 35727  // Starts a livereload server on port 35727
            },
            scripts: {
                files: ['js/**/*.js', 'templates/**/*'],
                tasks: ['js', 'copy']
            },
            styles: {
                files: ['sass/**/*.scss'],
                tasks: ['sass', 'copy']
            },
            quests: {
                files: zonesJson,
                tasks: ['quests', 'copy']
            },
            assets: {
                files: appAssets,
                tasks: ['copy:app']
            }
        }
    });
};
