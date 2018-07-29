module.exports = function (grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		jsdoc : {
			basic : {
				options : {
					destination : './doc/basic',
					configure : "jsdoc-conf.json"
				}
			},
			docstrap : {
				src : ['src/js/**.js', 'README.md'],
				options : {
					destination : './doc/docstrap',
					template : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
					configure : "node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},
		jshint : {
			files : ['gruntfile.js', 'src/js/*.js'],
			// configure JSHint (documented at http://www.jshint.com/docs/)
			options : {
				globals : {
					jQuery : true,
					console : true,
					module : true
				}
			}
		},
		license : {
			options : {},
			npm : {
				output : './licenses/npm_licenses.json'
			},
			bower : {
				directory : 'src/bower_components',
				output : './licenses/bower_licenses.json'
			}
		},
		jsonlint : {
			root : {
				src : ['./*.json']
			}
		},
		mkdir : {
			all : {
				options : {
					create : ['licenses']
				}
			}
		},
		git_changelog : {
			cwd : '.',
			manifest : "manifest.json",
			history : "history.txt",
			changelog : "changelog.txt",
			changesSeparator : '\n\t*********',
			masks : [{
					title : 'IMPLEMENTED:\n',
					mask : /(([^\.]+\s)*(Task|(Add))(\s[^\.]+)*)/gim,
					format : ' - #%h %an %ad: %s %b' // see http://git-scm.com/docs/git-log for mapping content,
				}, {
					title : 'FIXED:\n',
					mask : /(([^\.]+\s)*((Bug)|(fixed))(\s[^\.]+)*)/gim,
					format : ' - #%h %an %ad: %s %b'
				}, {
					title : 'OTHERS:\n',
					mask : /./gim,
					format : ' - #%h: %s %b'
				}
			]
		},
		requirejs : {
			build : {
				options : {
					baseUrl : "src/js",
					optimize : 'none', //none, uglify
					mainConfigFile : './src/js/config.js',
					name : 'config',
					optimizeCss : 'standard',
					paths : {
						requireLib : './../components/requirejs/require'
					},
					include : 'requireLib',
					logLevel : 0,
					findNestedDependencies : true,
					fileExclusionRegExp : /^\./,
					inlineText : true,
					out : 'dist/graphbuilder.js'
				}
			},
			build_min : {
				options : {
					baseUrl : "src/js",
					optimize : 'uglify', //none, uglify
					mainConfigFile : './src/js/config.js',
					name : 'config',
					paths : {
						requireLib : './../components/requirejs/require'
						//css : './../bower_components/require-css/css.min'
					},
					//modules : [{
					// name : 'config',
					//exclude: ['./../bower_components/require-css/normalize'],
					// include : 'requireLib'
					// }
					// ],
					include : 'requireLib',
					//exclude : ['./../bower_components/require-css/normalize'],
					logLevel : 0,
					//separateCSS : true,
					findNestedDependencies : true,
					fileExclusionRegExp : /^\./,
					inlineText : true,
					out : 'dist/graphbuilder.min.js'
				}
			}
		},
		madge : {
			options : {
				format : 'amd',
				force : true,
				breakOnError : false
			},
			all : ['src/js']
		},
		amdcheck : {
			dev : {
				options : {
					excepts : [],
					exceptsPaths : [],
					removeUnusedDependencies : false,
					logUnusedDependencyNames : true
				},
				files : [{
						src : ['src/js/**/*.js'],
						dest : 'build/'
					}
				]
			}
		},
		connect : {
			devServer : {
				options : {
					port : 8889,
					base : 'src',
					keepalive : true
				}
			},
			server : {
				options : {
					port : 8888,
					base : 'dist',
					keepalive : true
				}
			}
		},
        clean:['dist'],
		shell:{
			'mocha-phantomjs': {
				command: 'mocha-phantomjs http://localhost:8888',
				options: {
					stdout: true,
					stderr: true
				}
			}
		},
		watch: {
			jsFiles: {
				files: ['src/js/**/*.js'],
				tasks: ['shell:mocha-phantomjs']
			}
		}
	});

   //Load task
    grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.loadNpmTasks('grunt-mkdir');
	grunt.loadNpmTasks('grunt-git-changelog');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-madge');
	grunt.loadNpmTasks('grunt-amdcheck');
	grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-shell');


	grunt.registerTask('hint', 'jshint');
	grunt.registerTask('doc', 'jsdoc:basic');
	grunt.registerTask('docstrap', 'jsdoc:docstrap');
	grunt.registerTask('lint_json', 'jsonlint');
	grunt.registerTask('amd', ['amdcheck', 'madge']);
	grunt.registerTask('licenses', function (arg1) {
		grunt.task.run('mkdir');
		if (arg1 === 'npm') {
			grunt.loadNpmTasks('grunt-license');
		} else if (arg1 === 'bower') {
			grunt.loadNpmTasks('grunt-license-bower');
		} else {
			grunt.loadNpmTasks('grunt-license');
			grunt.task.run('license:npm');
			grunt.loadNpmTasks('grunt-license-bower');
			grunt.task.run('license:bower');
			return;
		}
		grunt.task.run('license:' + arg1);
	});


};
