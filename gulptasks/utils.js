/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false});

gulp.task('clean', ['clean-js']);


gulp.task('clean-js', function () {
  return gulp.src('.build/**.js', { read: false })
    .pipe(g.rimraf());
});
