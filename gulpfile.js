var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var webpack = require('webpack');
var config = require('./webpack.config.js');

var compiler = webpack(config);

// Copy index.html to .tmp
gulp.task('html', function(){
  gulp.src('app/index.html')
  .pipe(gulp.dest('.tmp'))
})

gulp.task('serve', ['html'], function() {

  //index.html watch
  gulp.watch('app/index.html', ['html']);

  //server watch
  $.nodemon({
    script: 'server/index.js',
    ext: 'js html',
    env: {
      'NODE_ENV': 'development'
    }
  });

  //webpack watch
  compiler.watch({}, function(err, stats) {
    console.log(stats.toString({
      timings: true,
    }));
  })
})
