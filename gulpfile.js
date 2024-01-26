const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

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

const plumberHtmlConfig = {
  errorHandler: notify.onError({
    title: 'HTML',
    message: 'Error <%= error.message %>',
    sound: false,
  }),
};

gulp.task('html', function () {
  return gulp
    .src('./src/*.html')
    .pipe(plumber(plumberHtmlConfig))
    .pipe(fileIncludeSettings)
    .pipe(gulp.dest('./dist'));
});

// SASS
const plumberSassConfig = {
  errorHandler: notify.onError({
    title: 'Styles',
    message: 'Error <%= error.message %>',
    sound: false,
  }),
};

gulp.task('sass', function () {
  return gulp
    .src('./src/scss/*.scss')
    .pipe(plumber(plumberSassConfig))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
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

gulp.task('watch', function () {
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./src/**/*.html', gulp.series('html'));
  gulp.watch('./src/img/**/*', gulp.parallel('images'));
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'images'),
    gulp.parallel('server', 'watch')
  )
);
