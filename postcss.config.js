module.exports = {
  plugins: [
    require('postcss-sort-media-queries')({
      sort: 'desctop-first',
    }),
    require('autoprefixer'),
  ],
};
