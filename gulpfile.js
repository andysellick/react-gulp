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

gulp.task('styles', function(){
	return gulp.src(paths.styles.src  + 'styles.less')
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(paths.styles.dest))
});

gulp.task('scripts', function(cb){
	process.env.NODE_ENV = 'production';
	browserify(paths.scripts.src  + 'main.js')
		.transform('babelify',{presets: ['es2015','react'] })
		.bundle()
		.on('error',function(e){
			gutil.log(e);
		})
		.pipe(source('main.js'))
		.pipe(buffer()) //convert streaming vinyl file object given by source() to buffered vinyl file object
		.pipe(uglify()) //minify JS
		.pipe(rename({suffix: '.min'})) //rename output to include .min
		.pipe(gulp.dest(paths.scripts.dest)) //pipe to destination
		
});

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'production';
});

gulp.task('default', ['styles','scripts'], function() {
  // place code for your default task here
});
