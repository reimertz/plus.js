/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    lazypipe = require('lazypipe'),
    stylish = require('jshint-stylish'),
    g = require('gulp-load-plugins')({lazy: false});

/**
 * Lint everything
 */
gulp.task('lint', ['jslint']);

/**
 * JS Hint
 */
gulp.task('jslint', function () {
  return gulp.src([
    'src/*.js',
    'gulpfile.js',
    'gulptasks/*.js'
  ])
    .pipe(jshint('./.jshintrc'))
    .pipe(g.cached('jshint'));
    
});

/**
 * Jshint with stylish reporter
 */
function jshint (jshintfile) {
  return lazypipe()
    .pipe(g.jshint, jshintfile)
    .pipe(g.jshint.reporter, stylish)();
}

