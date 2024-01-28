import gulp from "gulp";
import fileinclude from "gulp-file-include";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import sassGlob from "gulp-sass-glob";
import server from "gulp-server-livereload";
import clean from "gulp-clean";
import fs from "fs";
import sourcemaps from "gulp-sourcemaps";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.mjs";
import babel from "gulp-babel";
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import changed, { compareContents } from "gulp-changed";

const sass = gulpSass(dartSass);

// paths
const srcFolder = "./src";
const buildFolder = "./build";
const paths = {
  srcHtml: `${srcFolder}/html/**/*.html`,
  srcHtmlBlocks: `${srcFolder}/html/blocks/**/*.html`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcMainJs: `${srcFolder}/js/*.js`,
  srcJs: `${srcFolder}/js/**/*.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcImgFolder: `${srcFolder}/img/**/*`,
  buildImgFolder: `${buildFolder}/img`,
  srcFonts: `${srcFolder}/fonts/**/*`,
  buildFontsFolder: `${buildFolder}/fonts`,
  srcFiles: `${srcFolder}/files/**/*`,
  buildFilesFolder: `${buildFolder}/files`,
};

//Helper functions
const plumberNotify = (title) => ({
  errorHandler: notify.onError({
    title,
    message: "Error <%= error.message %>",
    sound: false,
  }),
});

// CLEAN
gulp.task("clean", function (done) {
  if (fs.existsSync(buildFolder)) {
    return gulp.src(buildFolder, { read: false }).pipe(clean());
  }
  done();
});

// HTML
const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("html", function () {
  return gulp
    .src([paths.srcHtml, `!${paths.srcHtmlBlocks}`])
    .pipe(changed(buildFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(fileinclude(fileIncludeSettings))
    .pipe(gulp.dest(buildFolder));
});

// SASS
gulp.task("sass", function () {
  return gulp
    .src(paths.srcScss)
    .pipe(sassGlob())
    .pipe(changed(paths.buildCssFolder, { hasChanged: compareContents }))
    .pipe(plumber(plumberNotify("SCSS")))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.buildCssFolder));
});

//JAVASCRIPT
gulp.task("js", function () {
  return gulp
    .src(paths.srcMainJs)
    .pipe(changed(paths.buildJsFolder))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.buildJsFolder));
});

// IMAGES
const imageminSettings = [
  gifsicle({ interlaced: true }),
  mozjpeg({ quality: 80, progressive: true }),
  optipng({ optimizationLevel: 2 }),
  svgo({
    plugins: [
      {
        name: "removeViewBox",
        active: true,
      },
      {
        name: "cleanupIDs",
        active: true,
      },
    ],
  }),
];

gulp.task("images", function () {
  return gulp
    .src(paths.srcImgFolder)
    .pipe(changed(paths.buildImgFolder))
    .pipe(imagemin(imageminSettings, { verbose: true }))
    .pipe(gulp.dest(paths.buildImgFolder));
});

// FONTS
gulp.task("fonts", function () {
  return gulp
    .src(paths.srcFonts)
    .pipe(changed(paths.buildFontsFolder))
    .pipe(gulp.dest(paths.buildFontsFolder));
});

// FILES
gulp.task("files", function () {
  return gulp
    .src(paths.srcFiles)
    .pipe(changed(paths.buildFilesFolder))
    .pipe(gulp.dest(paths.buildFilesFolder));
});

// START SERVER
const serverOptions = {
  livereload: true,
  open: true,
};

gulp.task("server", function () {
  return gulp.src(buildFolder).pipe(server(serverOptions));
});

//WATCH
gulp.task("watch", function () {
  gulp.watch(paths.srcHtml, gulp.parallel("html"));
  gulp.watch(paths.srcScss, gulp.parallel("sass"));
  gulp.watch(paths.srcJs, gulp.parallel("js"));
  gulp.watch(paths.srcImgFolder, gulp.parallel("images"));
  gulp.watch(paths.srcFonts, gulp.parallel("fonts"));
  gulp.watch(paths.srcFiles, gulp.parallel("files"));
});

gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("html", "sass", "js", "images", "fonts", "files"),
    gulp.parallel("server", "watch")
  )
);
