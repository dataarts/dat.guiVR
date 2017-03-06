/**
* dat-guiVR Javascript Controller Library for VR
* https://github.com/dataarts/dat.guiVR
*
* Copyright 2016 Data Arts Team, Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

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
        tasks: ['express:dev'],
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

  });

  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['concurrent:dev']);
  grunt.registerTask('publish', ['concurrent:publish']);
};
