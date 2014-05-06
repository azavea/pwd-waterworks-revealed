var local = require('./local.json');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "phonegap-build": {
      debug: {
        options: {
          archive: "app.zip",
          appId: local.appId,
          user: {
            token: local.token
          },
          pollRate: 3000,
          download: {
            ios: 'dist/ios.ipa'
          }
        }
      },
      release: {
        options: {
          isRepository: "true",
          appId: local.appId,
          user: {
            token: local.token
          }
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: 'app.zip'
        },
        expand: true,
        cwd: "../src/",
        src: ["index.html", "js/**/*.js", "css/**/*.css"]
      }
    }
  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-phonegap-build');

  // Default task.
  grunt.registerTask('default', ['compress', 'phonegap-build:debug']);
};