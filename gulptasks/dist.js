/* jshint node: true */
'use strict';

var gulp = require('gulp'),
    g = require('gulp-load-plugins')({lazy: false}),
    version = require('../package.json').version;

gulp.task('js-dist', function() {
  return gulp.src('src/index.js')
    .pipe(g.rename('plus.' + version + '.js'))
    .pipe(gulp.dest('dist/'+ version + '/'))
    .pipe(g.uglify({preserveComments:'some'}))
    .pipe(g.rename('plus.' + version + '.min.js'))
    .pipe(gulp.dest('dist/'+ version + '/'))
    .pipe(g.gzip())
    .pipe(gulp.dest('dist/'+ version + '/'))
    .pipe(g.cached('built-dist-js'));
});