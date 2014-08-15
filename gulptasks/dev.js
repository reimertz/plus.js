/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false});

gulp.task('js-dev', function() {
  return gulp.src('src/index.js')
    .pipe(g.rename('plus.js'))
    .pipe(gulp.dest('.build/'))
    .pipe(g.cached('built-js'));
});