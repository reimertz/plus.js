/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false});

gulp.task('js-dist', function() {
  return gulp.src('src/index.js')
    .pipe(g.rename('plus.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(g.uglify({preserveComments:'some'}))
    .pipe(g.rename('plus.min.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(g.gzip())
    .pipe(gulp.dest('dist/'))
    .pipe(g.cached('built-dist-js'));
});