const gulp = require('gulp');

gulp.task('hello', function (callback) {
  console.log('Hello from gulp!');
  callback();
});

gulp.task('friend', function (callback) {
  console.log('My Friend!');
  callback();
});

gulp.task('default', gulp.series('hello', 'friend'));
