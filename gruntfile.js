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
          './build/datguivr.js': [
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
        files: ['testserver.js', './build/*.js' ],
        tasks: ['copy:main']
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
      dev: {
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
    },

    copy: {
      main: {
        expand: true,
        flatten: true,
        src: './build/*.js',
        dest: './examples/js/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('publish', ['concurrent:publish']);
};
