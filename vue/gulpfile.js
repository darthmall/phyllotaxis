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
  return build('./js/Phyllotaxis.js', './build/js', {
    debug     : true,
    standalone: 'Phyllotaxis',
    paths     : ['./js']
  });
});

gulp.task('fonts', function () {
  return gulp.src('fonts/**/*')
    .pipe(gulp.dest('./build/fonts'));
});

gulp.task('styles', function () {
  return gulp.src('styles/**/*.css')
    .pipe(gulp.dest('./build/styles'));
});

gulp.task('html', function () {
  return gulp.src(['**/*.html', '!node_modules/**/*'])
    .pipe(gulp.dest('./build'));
});

gulp.task('build', ['browserify', 'styles', 'fonts', 'html']);

gulp.task('clean', function (cb) {
  del('build', cb);
});

gulp.task('watch', ['build'], function () {
  gulp.watch('js/**/*.{js,html}', ['browserify']);
});

gulp.task('serve', function () {
  connect()
    .use(serveStatic('build'))
    .listen(8000);

    $.util.log('Server listening on http://localhost:' + 8000);
});

gulp.task('default', ['clean'], function () {
  return gulp.start('build');
});
