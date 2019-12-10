const gulp = require('gulp');
const watch = require('gulp-watch');
const less = require('gulp-less');
const plumber = require('gulp-plumber');

gulp.task('css', function() {
  return gulp.src('./src/less/app.less')
    .pipe(plumber({
    	// end the process on error
    	// need it to re-start gulp-watch
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
  }))
  .pipe(less())
  .pipe(gulp.dest('./src/css'))
});

gulp.task('watch', function() {
  watch(['./src/less/*.less'], function() {
    return gulp.src('./src/less/app.less')
        .pipe(plumber({
        	// end the process on error
        	// need it to re-start gulp-watch
          handleError: function (err) {
            console.log(err);
            this.emit('end');
          }
      }))
      .pipe(less())
      .pipe(gulp.dest('./src/css'))
  });
});
