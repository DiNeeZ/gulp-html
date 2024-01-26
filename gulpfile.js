const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const sass = require('gulp-sass')(require('sass'));
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');

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
const fileIncludeSettings = {
  prefix: '@@',
  basepath: '@file',
};

gulp.task('html', function () {
  return gulp
    .src('./src/*.html')
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(gulp.dest('./dist'));
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

//JAVASCRIPT
gulp.task('js', function () {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./dist/js'));
});

// IMAGES
gulp.task('images', function () {
  return gulp
    .src('./src/img/**/*')
    .pipe(imagemin({ verbose: true }))
    .pipe(gulp.dest('./dist/img/'));
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

//WATCH
gulp.task('watch', function () {
  gulp.watch('./src/**/*.html', gulp.parallel('html'));
  gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
  gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
  gulp.watch('./src/img/**/*', gulp.parallel('images'));
  gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
  gulp.watch('./src/files/**/*', gulp.parallel('files'));
});

gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('html', 'sass', 'js', 'images', 'fonts', 'files'),
    gulp.parallel('server', 'watch')
  )
);
