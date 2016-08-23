module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    browserify: {
      options: {
        watch: !grunt.option('staging'),
        keepAlive: !grunt.option('staging'),
        transform: [
          ['babelify', {
            presets: 'es2015',
            compact: 'false',
          }]
        ],
        browserifyOptions: {
          debug: true
        }
      },
      dist: {
        files: {
          './examples/dist/build.js': [
            'modules/*.js'
          ],
          './examples/dist/vrviewer.js': [
            'modules/vrviewer/index.js'
          ],
          './examples/dist/vrpad.js': [
            'modules/vrpad/index.js'
          ],
          './examples/dist/datguivr.js': [
            'modules/datguivr/index.js'
          ]
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      scripts: {
        files: ['testserver.js', './examples/dist/*.js' ],
        tasks: []
      },
      html: {
        files: [ 'examples/*.html', 'examples/*.css' ],
        tasks: []
      }
    },

    express: {
      options: {
        port: 8000,
        harmony: true,
      },
      dev: {
        options: {
          script: 'testserver.js'
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['watch', 'browserify', 'express:dev'],
        options: {
          logConcurrentOutput: true
        },
      },
      publish: {
        tasks: ['browserify'],
        options: {
          logConcurrentOutput: true
        },
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['copy', 'concat', 'concurrent:target']);
  grunt.registerTask('publish', ['copy', 'concat', 'concurrent:publish']);
};
