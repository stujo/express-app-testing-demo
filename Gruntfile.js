module.exports = function (grunt) {

  // configuration
  grunt.initConfig({


    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: 'coverage/**/*.js'
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
        files: 'test/unit/*.js',
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


    mochaTest: {
      unit: {
        options: {
          reporter: 'spec'
        },
        src: '<%= grunt.option("testBasePath") %>' + 'test/unit/*.js'
      },
      route: {
        options: {
          reporter: 'spec'
        },
        src: '<%= grunt.option("testBasePath") %>' + 'test/route/*.js'
      },
      api: {
        options: {
          reporter: 'spec'
        },
        src: '<%= grunt.option("testBasePath") %>' + 'test/api/*.js'
      }
    },


    // start - code coverage settings

    clean: {
      coverage: {
        src: 'coverage/'
      },
      coverageIstrument: 'coverage/instrument/'
    },


    copy: {
      views: {
        src: 'app/views/*',
        dest: 'coverage/instrument/'
      },
      tests: {
        src: 'test/**/*',
        dest: 'coverage/instrument/'
      }
    },


    instrument: {
      files: 'app/*.js',
      options: {
        lazy: true,
        basePath: 'coverage/instrument/'
      }
    },


    storeCoverage: {
      options: {
        dir: 'coverage/reports'
      }
    },


    makeReport: {
      src: 'coverage/reports/*.json',
      options: {
        type: 'lcov',
        dir: 'coverage/reports',
        print: 'detail'
      }
    }

    // end - code coverage settings

  });


  // plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-istanbul');


  // tasks
  grunt.registerTask('server', ['concurrent:target']);
  grunt.registerTask('default', ['jshint', 'server']);
  grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:route', 'mochaTest:api']);

  grunt.registerTask('coverage', ['jshint', 'clean:coverage', 'copy:tests', 'copy:views',
    'setTestDir', 'instrument', 'mochaTest:unit', 'mochaTest:route', 'storeCoverage',
    'makeReport', 'clean:coverageIstrument']);

  grunt.registerTask('setTestDir', function () {
    grunt.option('testBasePath', 'coverage/instrument/');
  });

};
