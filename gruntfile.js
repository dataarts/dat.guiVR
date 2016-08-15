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
          './public/dist/build.js': [
            'modules/*.js'
          ],
        }
      }
    },

    copy: {
      main: {
        files: [{
          expand: true,
          flatten: true,
          src: ['html/*.html'],
          dest: 'public/'
        }]
      }
    },

    concat: {
      options: {
        separator: '\n',
        sourceMap: false,
        nonull: true
      },
      css: {
        src: [ 'css/*.css' ],
        dest: './public/dist/build.css'
      }
    },

    watch: {
      options: {
        livereload: true,
        spawn: false
      },
      scripts: {
        files: ['server.js', './public/dist/*.js' ],
        tasks: []
      },
      js: {
        files: [ 'css/*.css' ],
        tasks: [ 'concat' ]
      },
      html: {
        files: [ 'html/*.html' ],
        tasks: [ 'copy' ]
      }
    },

    express: {
      options: {
        port: 8000,
        harmony: true,
      },
      dev: {
        options: {
          script: 'server.js'
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
