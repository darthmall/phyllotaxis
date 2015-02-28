/* global require */

'use strict';
// generated on 2014-10-10 using generator-gulp-webapp 0.1.0

var browserify  = require('browserify');
var connect     = require('connect');
var del         = require('del');
var exec        = require('child_process').exec;
var glob        = require('glob');
var gulp        = require('gulp');
var pkg         = require('./package.json');
var serveStatic = require('serve-static');
var source      = require('vinyl-source-stream');

var path = {
  'build'      : 'build/',
  'components' : 'js/**/*.{html,js,less,vue}',
  'dist'       : 'dist/',
  'fonts'      : 'fonts/**/*.{ttf,otf,svg,eot,woff}',
  'html'       : 'index.html',
  'libs'       : Object.keys(pkg.dependencies),
  'main'       : 'main.js',
  'scripts'    : 'js/**/*.js',
  'styles'     : ['styles/**/*.{less,css}', 'js/component/**/*.less'],
  'tests'      : './tests/**/*.js'
};


// load plugins
var $ = require('gulp-load-plugins')();

function say(msg) {
  exec('say -v Fred "' + msg + '"');
}

function err(e) {
  $.util.log(e.message);
  say('Build failed');

  // jshint validthis: true
  this.emit('end');
}

var libBundle = browserify({
    cache        : {},
    debug        : true,
    fullPaths    : true,
    packageCache : {}
  })
  .require(path.libs);

// Bundler for incremental builds using watchify
var mainBundle = browserify(path.main, {
    debug        : true,
    paths        : ['./js'],
    standalone   : 'Phyllotaxis'
  })
  .external(path.libs)
  .transform('partialify');

// Bundle the JavaScript with Browserify
function build() {
  var bundle = mainBundle
    .bundle()
    .on('error', err);

  return bundle
    .pipe(source('js/main.js'))
    .pipe(gulp.dest(path.build));
};

// Check the JavaScript for errors with jshint
gulp.task('jshint', function () {
  return gulp.src(path.scripts)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')));
});

// Build library bundle
gulp.task('libs', function () {
  var bundle = libBundle
    .bundle()
    .on('error', err);

  return bundle
    .pipe(source('js/lib.js'))
    .pipe(gulp.dest(path.build));
});

// Run the builder
gulp.task('browserify', ['libs', 'jshint'], build);

// Move the fonts to the build directory
gulp.task('fonts', function () {
  return gulp.src(path.fonts)
    .pipe($.flatten())
    .pipe(gulp.dest(path.build + 'fonts/'));
});

// Compile styles into the build directory
gulp.task('styles', function () {
  var filter = $.filter(['**/*.less', '**/!_*.less']);

  return gulp.src(path.styles)
    .pipe(filter)
    .pipe($.less())
    .on('error', err)
    .pipe($.concat('screen.css'))
    .pipe(filter.restore())
    .pipe($.filter('**/*.css'))
    .pipe(gulp.dest(path.build + 'styles'));
});

// Move the HTML into the build directory
gulp.task('html', function () {
  return gulp.src(path.html)
    .pipe(gulp.dest(path.build));
});

// Build everything
gulp.task('build', ['libs', 'browserify', 'styles', 'fonts', 'html']);

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
  gulp.watch('./package.json', ['libs']);
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

gulp.task('test', function () {
  var bundler = browserify(glob.sync(path.tests), {
    debug : true,
    paths : ['./js'],
  })
  .external(path.libs)
  .transform('vueify')
  .transform('partialify');

  var bundle = bundler
    .bundle()
    .on('error', err);

  return bundle
    .pipe(source('js/tests.js'))
    .pipe(gulp.dest(path.build))
    .pipe($.mocha({ reporter: 'spec' }));
});

gulp.task('default', ['clean'], function () {
  return gulp.start('build');
});
