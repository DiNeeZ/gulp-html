import gulp from 'gulp';

// HTML
import fileinclude from 'gulp-file-include';

// SASS
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import sassGlob from 'gulp-sass-glob';

// IMAMGES
import imagemin from 'gulp-imagemin';
import avif from 'gulp-avif';
import webp from 'gulp-webp';

import server from 'gulp-server-livereload';
import clean from 'gulp-clean';
import fs from 'fs';
import sourcemaps from 'gulp-sourcemaps';
import plumber from 'gulp-plumber';
import webpack from 'webpack-stream';
import webpackConfig from '../webpack.config.mjs';
import babel from 'gulp-babel';
import changed, { compareContents } from 'gulp-changed';
import {
  pathsDev as paths,
  plumberNotify,
  fileIncludeSettings,
  imageminSettings,
  serverOptions,
} from './utils.gulp.mjs';

const sass = gulpSass(dartSass);

// CLEAN
gulp.task('clean:dev', function (done) {
  if (fs.existsSync(paths.buildFolder)) {
    return gulp.src(paths.buildFolder, { read: false }).pipe(clean());
  }
  done();
});

// HTML
gulp.task('html:dev', function () {
  return gulp
    .src([paths.srcHtml, `!${paths.srcHtmlBlocks}`])
    .pipe(changed(paths.buildFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify('HTML')))
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(gulp.dest(paths.buildFolder));
});

// SASS
gulp.task('sass:dev', function () {
  return gulp
    .src(paths.srcScss)
    .pipe(sassGlob())
    .pipe(changed(paths.buildCssFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify('SCSS')))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildCssFolder));
});

//JAVASCRIPT
gulp.task('js:dev', function () {
  return gulp
    .src(paths.srcMainJs)
    .pipe(changed(paths.buildJsFolder))
    .pipe(plumber(plumberNotify('JS')))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.buildJsFolder));
});

// IMAGES
gulp.task('images:dev', function () {
  return gulp
    .src([
      `${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`,
      `!${paths.srcImgFolder}/svg/**/*.svg`,
    ])
    .pipe(changed(paths.buildImgFolder))
    .pipe(imagemin(imageminSettings, { verbose: true }))
    .pipe(gulp.dest(paths.buildImgFolder));
});

// AVIF IMAGES
gulp.task('avif:dev', function () {
  return gulp
    .src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(changed(paths.buildImgFolder))
    .pipe(avif())
    .pipe(gulp.dest(paths.buildImgFolder));
});

// WEBP IMAGES
gulp.task('webp:dev', function () {
  return gulp
    .src([`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`])
    .pipe(changed(paths.buildImgFolder))
    .pipe(webp())
    .pipe(gulp.dest(paths.buildImgFolder));
});

// FONTS
gulp.task('fonts:dev', function () {
  return gulp
    .src(paths.srcFonts)
    .pipe(changed(paths.buildFontsFolder))
    .pipe(gulp.dest(paths.buildFontsFolder));
});

// FILES
gulp.task('files:dev', function () {
  return gulp
    .src(paths.srcFiles)
    .pipe(changed(paths.buildFilesFolder))
    .pipe(gulp.dest(paths.buildFilesFolder));
});

// START SERVER
gulp.task('server:dev', function () {
  return gulp.src(paths.buildFolder).pipe(server(serverOptions));
});

//WATCH
gulp.task('watch:dev', function () {
  gulp.watch(paths.srcHtml, gulp.parallel('html:dev'));
  gulp.watch(paths.srcScss, gulp.parallel('sass:dev'));
  gulp.watch(paths.srcJs, gulp.parallel('js:dev'));
  gulp.watch(
    [
      `${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`,
      `!${paths.srcImgFolder}/svg/**/*.svg`,
    ],
    gulp.parallel('images:dev')
  );
  gulp.watch(
    `${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`,
    gulp.parallel('avif:dev')
  );
  gulp.watch(
    `${paths.srcImgFolder}/**/*.{jpg,jpeg,png}`,
    gulp.parallel('webp:dev')
  );
  gulp.watch(paths.srcFonts, gulp.parallel('fonts:dev'));
  gulp.watch(paths.srcFiles, gulp.parallel('files:dev'));
});
