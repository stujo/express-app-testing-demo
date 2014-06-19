module.exports = function (grunt) {

  // configuration
  grunt.initConfig({


    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['test/coverage/**/*.js']
      },
      files: {
        src: ['app/**/*.js', 'test/**/*.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },


    watch: {
      lint: {
        files: '<%= jshint.files.src %>',
        tasks: 'jshint'
      },
      test: {
        files: ['test/unit/*.js'],
        tasks: ['jshint', 'mochaTest:unit']
      }
    },


    nodemon: {
      dev: {
        script: 'app/app.js',
        options: {
          ext: 'js,json'
        }
      }
    },


    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },


    shell: {
      coverage: {
        command: './node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha ' +
          '-- test/**/*.js -R spec'
      },
      test: {
        command: './node_modules/.bin/mocha test/**/*.js -R spec'
      }
    }


  });


  // plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');


  // tasks
  grunt.registerTask('server', ['concurrent:target']);
  grunt.registerTask('default', ['jshint', 'server']);
  grunt.registerTask('test', ['shell:test']);
  grunt.registerTask('coverage', ['shell:coverage']);

};
