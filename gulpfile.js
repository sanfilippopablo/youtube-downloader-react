var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');
var assign = require('lodash.assign');

// SCRIPTS

var browserifyOpts = {
  entries: './app/scripts/main.jsx',
  debug: true,
  // defining transforms here will avoid crashing your stream
  transform: [reactify]
};

var opts = assign({}, watchify.args, browserifyOpts);
var b = watchify(browserify(opts));

gulp.task('scripts', bundle);
//b.on('update', bundle); // Watch and rebuild on changes
b.on('log', $.util.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe($.sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe($.sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./.tmp/scripts/'));
}


// STYLES
gulp.task('styles', function() {
  return gulp.src('app/styles/main.scss')
    .pipe($.sass({
      outputStyle: 'compressed',
      sourceComments: 'map'
    }, {
      errLogToConsole: true
    }))
    .pipe($.autoprefixer("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('build/styles'));
});

// SERVE
gulp.task('serve', ['styles', 'scripts'], function() {
  // Start server
  $.nodemon({
    script: 'server/index.js',
    ext: 'js html',
    env: {'NODE_ENV': 'development'}
  });

  //Recompile styles
  gulp.watch('app/styles/**/*.scss', ['styles']);

  //Recompile scripts
  gulp.watch('app/scripts/**/*.jsx', ['scripts']);

})
