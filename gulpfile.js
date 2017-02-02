'use strict'
// File paths
const paths = {
	templates: {
		src: 'src/',
		dest: 'dist/'
	},
	images: {
	  src:  'src/static/img/',
	  dest: 'dist/static/img/'
	},
	scripts: {
		src:  'src/static/js/',
		dest: 'dist/static/js/'
	},
	styles: {
		src:  'src/static/less/',
		dest: 'dist/static/css/'
	},
	assets: {
		src:  'src/static/assets/',
		dest: 'dist/static/assets/'
	},
	bower: {
		src:  'src/static/bower_components/',
		dest: 'dist/static/bower_components/'
	}
};

var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var babelify = require('babelify');
var browserify = require('browserify');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserSync = require('browser-sync').create();
var htmlmin = require('gulp-htmlmin');
var newer = require('gulp-newer');
var eslint = require('gulp-eslint');

//copy and minify HTML files to dist
gulp.task('html',function(){
	return gulp.src(paths.templates.src + '**/*.html')
		.pipe(htmlmin({collapseWhitespace:true, minifyJS: true, minifyCSS: true}))
		.pipe(newer(paths.templates.dest))
		.on('error',function(e){
			const error = gutil.colors.red;
			gutil.log(error('Error in html:',e.message));
		})
		.pipe(gulp.dest(paths.templates.dest))
});

//copy, compile and minify Less to dist
gulp.task('styles', function(){
	return gulp.src(paths.styles.src  + 'styles.less')
		.pipe(less())
		.pipe(newer(paths.styles.dest))
		.on('error',function(e){
			const error = gutil.colors.red;
			gutil.log(error('Error in styles:',e.message));
		})
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream())
});

//copy, compile and minify JS to dist
gulp.task('scripts', ['eslint'], function(){
	process.env.NODE_ENV = 'production';
	browserify(paths.scripts.src  + 'main.js')
		.transform('babelify',{presets: ['es2015','react'] })
		.bundle()
		.on('error',function(e){
			const error = gutil.colors.red;
			gutil.log(error('Error in script:',e.message));
		})
		.pipe(source('main.js'))
		.pipe(buffer()) //convert streaming vinyl file object given by source() to buffered vinyl file object
		.pipe(uglify()) //minify JS
		.pipe(rename({suffix: '.min'})) //rename output to include .min
		.pipe(gulp.dest(paths.scripts.dest)) //pipe to destination
		.pipe(browserSync.stream())		
});

gulp.task('eslint', function(){
	return gulp.src(paths.scripts.src + '**/*.js')
		.pipe(eslint({
			baseConfig: {
				"parserOptions": {
					"ecmaFeatures": {
						"jsx": true,
						"modules": true
					}
				},
				"parser": "babel-eslint",
				"rules":{
					"eqeqeq": 1,
					"curly":1,
					"quotes": ["warn", "single"],					
					"curly": 1,
					"camelcase": 1,
					"globals": {
						"angular": 1,
						"React": 1,
						"$": 1,
						"jQuery": 1
					}					
				}
			}
		}))
		.pipe(eslint.format())
		.pipe(eslint.failAfterError())
});

//copy assets to dist
gulp.task('assets', () => {
	return gulp.src(paths.assets.src + '**/*') 
		.pipe(newer(paths.assets.dest))
		.pipe(gulp.dest(paths.assets.dest))
});


//start browsersync
gulp.task('browser-sync', ['styles', 'scripts', 'html', 'assets'], function() {
    browserSync.init({
		server: {
			baseDir: './dist/',
			logLevel: 'debug'
		}
		// notify: false Will not show notify banner on reload or injected
		// open: false; Will not open a browser window automatically
		// online: false; Will not attempt to determine your network status
    });
	gulp.watch(paths.styles.src + '**/*.less', ['styles']);
	gulp.watch(paths.scripts.src + '**/*.js', ['scripts']);
	gulp.watch(paths.templates.src + '**/*.html', ['html']);
	//gulp.watch(paths.images.src + '**/*', ['images']).on('change', browserSync.reload);
	gulp.watch(paths.assets.src + '**/*', ['assets']).on('change', browserSync.reload);		
});

gulp.task('default', function() {
	gulp.start('browser-sync');
});
