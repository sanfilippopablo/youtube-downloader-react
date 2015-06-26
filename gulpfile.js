var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var webpack = require('webpack');
var _ = require('lodash');

var baseConfig = require('./webpack.config.js');
var developmentConfig = _.cloneDeep(baseConfig);
developmentConfig.output.path = __dirname + '/.tmp';
var productionConfig = _.cloneDeep(baseConfig);
productionConfig.output.path = __dirname + '/build';

// Copy index.html to .tmp
gulp.task('html', function(){
  gulp.src('app/index.html')
  .pipe(gulp.dest('.tmp'))
  .pipe(gulp.dest('build'))
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

  var compiler = webpack(developmentConfig);
  //webpack watch
  compiler.watch({}, function(err, stats) {
    console.log(stats.toString({
      timings: true,
    }));
  })
})

gulp.task('build', ['html'], function(done){
  var compiler = webpack(productionConfig);
  compiler.run(done);
})
