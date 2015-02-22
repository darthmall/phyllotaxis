'use strict';
// generated on 2014-10-10 using generator-gulp-webapp 0.1.0

var browserify  = require('browserify');
var connect     = require('connect');
var del         = require('del');
var gulp        = require('gulp');
var serveStatic = require('serve-static');
var source      = require('vinyl-source-stream');

var path = {
  'build'      : 'build/',
  'components' : 'js/**/*.{html,js,less,vue}',
  'dist'       : 'dist/',
  'fonts'      : 'fonts/**/*.{ttf,otf,svg,eot,woff}',
  'html'       : 'index.html',
  'main'       : 'main.js',
  'scripts'    : 'js/**/*.js',
  'styles'     : 'styles/**/*.less',
  'tests'      : 'tests/'
};

// load plugins
var $ = require('gulp-load-plugins')();

// Bundle the JavaScript with Browserify
function build(opts) {
  var bundleStream = browserify(path.main, opts)
    .transform('vueify')
    .transform('partialify')
    .bundle()
    .on('error', function (e) {
      $.util.log(e.message);
      this.emit('end');
    });

  return bundleStream
    .pipe(source(path.main))
    .pipe($.rename('Phyllotaxis.js'))
    .pipe(gulp.dest(path.build));
};

// Check the JavaScript for errors with jshint
gulp.task('jshint', function () {
  return gulp.src(path.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

// Run the builder
gulp.task('browserify', ['jshint'], function () {
  return build({
    debug     : true,
    standalone: 'Phyllotaxis',
    paths     : ['./js']
  });
});

// Move the fonts to the build directory
gulp.task('fonts', function () {
  return gulp.src(path.fonts)
    .pipe($.flatten())
    .pipe(gulp.dest(path.build + 'fonts/'));
});

// Compile styles into the build directory
gulp.task('styles', function () {
  return gulp.src(path.styles)
    .pipe($.less())
    .pipe(gulp.dest(path.build));
});

// Move the HTML into the build directory
gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(gulp.dest(path.build));
});

// Build everything
gulp.task('build', ['browserify', 'styles', 'fonts', 'html']);

// Create a zip file suitable for deploying to a server with optimized
// JavaScript and CSS
gulp.task('dist', ['styles', 'fonts', 'html'], function () {
});

// Clean up build artifacts
gulp.task('clean', function (cb) {
  del([path.build, path.dist], cb);
});

// Monitor code for changes and rebuild
gulp.task('watch', ['build'], function () {
  gulp.watch(path.components, ['browserify']);
  gulp.watch(path.fonts, ['fonts']);
  gulp.watch(path.styles, ['styles']);
  gulp.watch(path.html, ['html']);
});

// Run a development server
gulp.task('serve', function () {
  connect()
    .use(serveStatic(path.build))
    .listen(8000);

    $.util.log('Server listening on http://localhost:' + 8000);

  $.livereload.listen({ port: 35729 });

	gulp.watch(path.build + '/**/*')
    .on('change', function (path) {
      $.livereload.changed(path);
    });
});

gulp.task('default', ['clean'], function () {
  return gulp.start('build');
});
