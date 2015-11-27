/*!
 * SUI Mobile
 */

module.exports = function(grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    RegExp.quote = function(string) {
        return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    };

    var buildTo = grunt.option('buildTo');
    var dist = buildTo ? (buildTo + '/') : 'dist/';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Metadata.
        meta: {
            distPath: dist,
            doclessetsPath: 'docs/assets/',
            docsDistPath: 'docs/dist/',
            docsPath: 'docs/',
            //basePath: 'node_modules/@ali/msui-base/'
            basePath: 'base/'
        },

        clean: {
            dist: ['<%= meta.distPath %>', '<%= meta.docsDistPath %>']
        },

        webpack: {
            options: {
                entry: {
                    "msui": "./msui.js"
                },
                output: {
                    path: '<%= meta.distPath %>js',
                    filename: "[name].js"
                },

            }
        },
        concat: {
            msui: {
              options: {
              },
              src: [
                  'js/intro.js',
                  'js/device.js',
                  'js/util.js',
                  'js/detect.js',
                  'js/zepto-adapter.js',
                  'js/fastclick.js',
                  'js/page.js',
                  'js/tabs.js',
                  'js/modal.js',
                  'js/calendar.js',
                  'js/picker.js',
                  'js/datetime-picker.js',
                  'js/iscroll.js',
                  'js/scroller.js',
                  'js/pull-to-refresh-js-scroll.js',
                  'js/pull-to-refresh.js',
                  'js/infinite-scroll.js',
                  'js/searchbar.js',
                  'js/panels.js',
                  'js/router.js',
                  'js/init.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>.js'
            },
            extend: {
              options: {
              },
              src: [
                  'js/swiper.js',
                  'js/swiper-init.js',
                  'js/photo-browser.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>-extend.js'
            },
            cityPicker: {
              options: {
              },
              src: [
                  'js/city-data.js',
                  'js/city-picker.js'
              ],
              dest: '<%= meta.distPath %>js/<%= pkg.name %>-city-picker.js'
            }
        },


        less: {
            options: {
                paths: ['./', '<%= meta.basePath %>'],
                ieCompat: false
            },
            core: {
                src: 'msui.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>.css'
            },
            extend: {
                src: 'less/msui-extend.less',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-extend.css'
            },
            docs: {
                src:  '<%= meta.doclessetsPath %>css/docs.less',
                dest: '<%= meta.doclessetsPath %>css/docs.css'
            },
            demos: {
                src:  '<%= meta.doclessetsPath %>css/demos.less',
                dest: '<%= meta.doclessetsPath %>css/demos.css'
            }
        },

        csscomb: {
            options: {
                config: 'less/.csscomb.json'
            },
            core: {
                files: {
                    '<%= less.core.dest %>': '<%= less.core.dest %>'
                }
            },
            docs: {
                files: {
                    '<%= less.docs.dest %>': '<%= less.docs.dest %>'
                }
            }
        },

        copy: {
            fonts: {
                expand: true,
                src: 'fonts/*',
                dest: '<%= meta.distPath %>'
            },
            img: {
                expand: true,
                src: 'img/*',
                dest: '<%= meta.distPath %>'
            },
            docs: {
                expand: true,
                cwd: '<%= meta.distPath %>',
                src: [
                    '**/*'
                ],
                dest: '<%= meta.docsDistPath %>'
            }
        },

        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24', // Firefox 24 is the latest ESR
                    'Explorer >= 9',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            core: {
                src: '<%= less.core.dest %>'
            },
            extend: {
                src: '<%= less.extend.dest %>'
            },
            docs: {
                src: '<%= less.docs.dest %>'
            },
            demos: {
                src: '<%= less.demos.dest %>'
            }
        },

        cssmin: {
            options: {
                keepSpecialComments: '*' ,// keep all important comments
                advanced: false
            },
            msui: {
                src: '<%= meta.distPath %>css/<%= pkg.name %>.css',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>.min.css'
            },
            extend: {
                src: '<%= meta.distPath %>css/<%= pkg.name %>-extend.css',
                dest: '<%= meta.distPath %>css/<%= pkg.name %>-extend.min.css'
            },
            docs: {
                src: [
                    '<%= meta.doclessetsPath %>css/docs.css'
                ],
                dest: '<%= meta.doclessetsPath %>css/docs.min.css'
            }
        },

        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true,
                preserveComments: false
            },
            msui: {
                src: '<%= concat.msui.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>.min.js'
            },
            extend: {
                src: '<%= concat.extend.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>-extend.min.js'
            },
            cityPicker: {
                src: '<%= concat.cityPicker.dest %>',
                dest: '<%= meta.distPath %>js/<%= pkg.name %>-city-picker.min.js'
            },
            docs: {
                src: [
                    '<%= meta.doclessetsPath %>js/docs.js',
                    '<%= meta.doclessetsPath %>js/fingerblast.js'
                ],
                dest: '<%= meta.doclessetsPath %>js/docs.min.js'
            }
        },

        qunit: {
            options: {
                inject: 'js/tests/unit/phantom.js'
            },
            files: 'js/tests/index.html'
        },

        watch: {
            options: {
                hostname: 'localhost',
                livereload: true,
                port: 8000
            },
            js: {
                files: '<%= meta.basePath %>**/*.js',
                tasks: ['dist-js', 'copy']
            },
            cityPicker: {
                files: ['<%= meta.basePath %>city-*.js'],
                tasks: ['dist-js:cityPicker', 'copy']
            },
            css: {
                files: '<%= meta.basePath %>**/*.less',
                tasks: ['dist-css', 'copy']
            },
            html: {
                files: '<%= meta.docsPath %>**',
                tasks: ['jekyll']
            }
        },

        jekyll: {
            docs: {}
        },

        eslint: {
            options: {
                configFile: '.eslintrc',
            },
            target: [
                'Gruntfile.js',
                'msui.js',
                'extend_components/**/*.js'
                '<%= meta.basePath %>**/*.js',
                '<%= meta.basePath %>**/*.jsx'
            ]
        },


        connect: {
            site: {
                options: {
                    base: '_site/',
                    hostname: '0.0.0.0',
                    livereload: true,
                    open: true,
                    port: 8000
                }
            }
        }
    });

    // Load the plugins
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

  // Default task(s).
  grunt.registerTask('dist-css', ['less', 'autoprefixer', 'csscomb', 'cssmin']);
  grunt.registerTask('dist-js', ['concat', 'uglify']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'dist-js', 'copy']);
  grunt.registerTask('validate-html', ['jekyll']);
  grunt.registerTask('build', ['dist']);
  grunt.registerTask('test', ['dist', 'eslint', 'qunit', 'validate-html']);
  grunt.registerTask('server', ['dist', 'jekyll', 'connect', 'watch']);
  if(buildTo) {
    //CDN发布环境
    grunt.registerTask('default', ['dist-js', 'dist-css', 'copy']);
  } else {
    //开发环境
    grunt.registerTask('default', ['test', 'dist']);
  }

  // Version numbering task.
  // grunt change-version-number --oldver=A.B.C --newver=X.Y.Z
  // This can be overzealous, so its changes should always be manually reviewed!
};