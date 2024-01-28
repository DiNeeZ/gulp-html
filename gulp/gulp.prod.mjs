import gulp from "gulp";
import fileinclude from "gulp-file-include";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import sassGlob from "gulp-sass-glob";
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
import sourcemaps from "gulp-sourcemaps";
import groupMedia from "gulp-group-css-media-queries";
import plumber from "gulp-plumber";
import webpack from "webpack-stream";
import webpackConfig from "../webpack.config.mjs";
import babel from "gulp-babel";
import imagemin from "gulp-imagemin";
import changed, { compareContents } from "gulp-changed";
import {
  pathsProd as paths,
  plumberNotify,
  fileIncludeSettings,
  imageminSettings,
  serverOptions,
} from "./gulp.utils.mjs";

const sass = gulpSass(dartSass);

// CLEAN
gulp.task("clean:prod", function (done) {
  if (fs.existsSync(paths.buildFolder)) {
    return gulp.src(paths.buildFolder, { read: false }).pipe(clean());
  }
  done();
});

// HTML
gulp.task("html:prod", function () {
  return gulp
    .src([paths.srcHtml, `!${paths.srcHtmlBlocks}`])
    .pipe(changed(paths.buildFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(gulp.dest(paths.buildFolder));
});

// SASS
gulp.task("sass:prod", function () {
  return gulp
    .src(paths.srcScss)
    .pipe(sassGlob())
    .pipe(changed(paths.buildCssFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourcemaps.init())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildCssFolder));
});

//JAVASCRIPT
gulp.task("js:prod", function () {
  return gulp
    .src(paths.srcMainJs)
    .pipe(changed(paths.buildJsFolder))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.buildJsFolder));
});

// IMAGES
gulp.task("images:prod", function () {
  return gulp
    .src(paths.srcImgFolder)
    .pipe(changed(paths.buildImgFolder))
    .pipe(imagemin(imageminSettings, { verbose: true }))
    .pipe(gulp.dest(paths.buildImgFolder));
});

// FONTS
gulp.task("fonts:prod", function () {
  return gulp
    .src(paths.srcFonts)
    .pipe(changed(paths.buildFontsFolder))
    .pipe(gulp.dest(paths.buildFontsFolder));
});

// FILES
gulp.task("files:prod", function () {
  return gulp
    .src(paths.srcFiles)
    .pipe(changed(paths.buildFilesFolder))
    .pipe(gulp.dest(paths.buildFilesFolder));
});

// START SERVER
gulp.task("server:prod", function () {
  return gulp.src(paths.buildFolder).pipe(server(serverOptions));
});

//WATCH
gulp.task("watch:prod", function () {
  gulp.watch(paths.srcHtml, gulp.parallel("html:prod"));
  gulp.watch(paths.srcScss, gulp.parallel("sass:prod"));
  gulp.watch(paths.srcJs, gulp.parallel("js:prod"));
  gulp.watch(paths.srcImgFolder, gulp.parallel("images:prod"));
  gulp.watch(paths.srcFonts, gulp.parallel("fonts:prod"));
  gulp.watch(paths.srcFiles, gulp.parallel("files:prod"));
});
