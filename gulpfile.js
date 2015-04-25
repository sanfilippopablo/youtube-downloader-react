var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var reactify = require('reactify');

// SCRIPTS
gulp.task('scripts', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './app/scripts/main.jsx',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [reactify]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe($.uglify())
        .on('error', $.util.log)
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('./.tmp/scripts/'));
});

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
gulp.task('serve', function() {
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
