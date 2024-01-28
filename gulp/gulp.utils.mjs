import { gifsicle, mozjpeg, optipng, svgo } from "gulp-imagemin";
import notify from "gulp-notify";

const srcFolder = "./src";
const buildFolderDev = "./build";
const buildFolderProd = "./dist";

export const pathsDev = {
  srcFolder,
  buildFolder: buildFolderDev,
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

export const pathsProd = {
  srcFolder,
  buildFolder: buildFolderProd,
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

export const plumberNotify = (title) => ({
  errorHandler: notify.onError({
    title,
    message: "Error <%= error.message %>",
    sound: false,
  }),
});

export const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

export const imageminSettings = [
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

export const serverOptions = {
  livereload: true,
  open: true,
};
