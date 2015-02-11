'use strict';
// generated on 2014-10-10 using generator-gulp-webapp 0.1.0

var browserify  = require('browserify');
var connect     = require('connect');
var del         = require('del');
var gulp        = require('gulp');
var serveStatic = require('serve-static');
var source      = require('vinyl-source-stream');

// load plugins
var $ = require('gulp-load-plugins')();

function build(src, dst, opts) {
  var bundleStream = browserify(src, opts).bundle()
    .on('error', function (e) {
      $.util.log(e.message);
      this.emit('end');
    });

  return bundleStream
    .pipe(source(src))
    .pipe($.rename('Phyllotaxis.js'))
    .pipe(gulp.dest(dst));
};

gulp.task('scripts', function () {
  return gulp.src('js/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('browserify', ['scripts'], function () {
  return build('./js/Phyllotaxis.js', './', {
    debug     : true,
    standalone: 'Phyllotaxis',
    paths     : ['./js']
  });
});

gulp.task('clean', function (cb) {
  del('Phyllotaxis.js', cb);
});

gulp.task('watch', function () {
  gulp.start('browserify');
  gulp.watch('js/**/*.{js,html}', ['browserify']);
});

gulp.task('serve', function () {
  connect()
    .use(serveStatic('.'))
    .listen(8000);

    $.util.log('Server listening on http://localhost:' + 8000);
});

gulp.task('default', function () {
  return gulp.start('browserify');
});
