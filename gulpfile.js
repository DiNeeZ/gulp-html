const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

//Helper functions
const plumberNotify = (title) => ({
  errorHandler: notify.onError({
    title,
    message: 'Error <%= error.message %>',
    sound: false,
  }),
});

// CLEAN
gulp.task('clean', function (done) {
  if (fs.existsSync('./dist/')) {
    return gulp.src('./dist/', { read: false }).pipe(clean());
  }
  done();
});

// HTML
const fileIncludeSettings = fileInclude({
  prefix: '@@',
  basepath: '@file',
});

gulp.task('html', function () {
  return gulp
    .src('./src/*.html')
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileIncludeSettings)
    .pipe(gulp.dest('./dist/'));
});

// SASS
gulp.task('sass', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'));
});

// IMAGES
gulp.task('images', function () {
  return gulp.src('./src/img/**/*').pipe(gulp.dest('./dist/img/'));
});

// FONTS
gulp.task('fonts', function () {
  return gulp.src('./src/fonts/**/*').pipe(gulp.dest('./dist/fonts/'));
});

// FILES
gulp.task('files', function () {
  return gulp.src('./src/files/**/*').pipe(gulp.dest('./dist/files/'));
});

// START SERVER
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task('server', function () {
  return gulp.src('./dist/').pipe(server(serverOptions));
});

gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./src/**/*.html', gulp.series('html'));
  gulp.watch('./src/img/**/*', gulp.parallel('images'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
  gulp.watch('./src/files/**/*', gulp.parallel('files'));
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'images', 'fonts', 'files'),
    gulp.parallel('server', 'watch')
  )
);
