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

//copy and minify HTML files to dist
gulp.task('html',function(){
	return gulp.src(paths.templates.src + '**/*.html')
		.pipe(htmlmin({collapseWhitespace:true, minifyJS: true, minifyCSS: true}))
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
gulp.task('scripts', function(){
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

//start browsersync
gulp.task('browser-sync',  function() {
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
	//gulp.watch(paths.assets.src + '**/*', ['assets']).on('change', browserSync.reload);		
});

gulp.task('default', ['styles', 'scripts', 'html'], function() {
	gulp.start('browser-sync');
});
