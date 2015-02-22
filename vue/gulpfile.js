'use strict';
// generated on 2014-10-10 using generator-gulp-webapp 0.1.0

var browserify  = require('browserify');
var connect     = require('connect');
var del         = require('del');
var gulp        = require('gulp');
var serveStatic = require('serve-static');
var source      = require('vinyl-source-stream');

var path = {
  'build'   : 'build/',
  'dist'    : 'dist/',
  'fonts'   : 'fonts/**/*.{ttf,otf,svg,eot,woff}',
  'html'    : 'index.html',
  'main'    : 'js/Phyllotaxis.js',
  'scripts' : 'js/**/*.js',
  'styles'  : 'styles/**/*.less',
  'tests'   : 'tests/'
};

// load plugins
var $ = require('gulp-load-plugins')();

function build(opts) {
  var bundleStream = browserify(path.main, opts).bundle()
    .on('error', function (e) {
      $.util.log(e.message);
      this.emit('end');
    });

  return bundleStream
    .pipe(source(path.main))
    .pipe($.rename('Phyllotaxis.js'))
    .pipe(gulp.dest(path.build));
};

gulp.task('jshint', function () {
  return gulp.src(path.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

gulp.task('browserify', ['jshint'], function () {
  return build({
    debug     : true,
    standalone: 'Phyllotaxis',
    paths     : ['./js']
  });
});

gulp.task('fonts', function () {
  return gulp.src(path.fonts)
    .pipe($.flatten())
    .pipe(gulp.dest(path.build + 'fonts/'));
});

gulp.task('styles', function () {
  return gulp.src(path.styles)
    .pipe(gulp.dest(path.build));
});

gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(gulp.dest(path.build));
});

gulp.task('build', ['browserify', 'styles', 'fonts', 'html']);

gulp.task('dist', ['styles', 'fonts', 'html'], function () {
});

gulp.task('clean', function (cb) {
  del([path.build, path.dist], cb);
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
