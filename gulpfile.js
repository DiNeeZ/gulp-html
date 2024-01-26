const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');

// CLEAN
gulp.task('clean', function (done) {
  if (fs.existsSync('./dist/')) {
    return gulp.src('./dist/', { read: false }).pipe(clean());
  }
  done();
});

// INCLUDE FILES
const fileIncludeSettings = fileInclude({
  prefix: '@@',
  basepath: '@file',
});

gulp.task('html', function () {
  return gulp
    .src('./src/*.html')
    .pipe(fileIncludeSettings)
    .pipe(gulp.dest('./dist/'));
});

// SASS
gulp.task('sass', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/css'));
});

// COPY IMAGES
gulp.task('images', function () {
  return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img/'));
});

// START SERVER
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server', function () {
  return gulp.src('./dist/').pipe(server(serverOptions));
});
