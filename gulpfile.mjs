import gulp from 'gulp';
import './gulp/dev.gulp.mjs';
import './gulp/prod.gulp.mjs';

gulp.task(
  'default',
  gulp.series(
    gulp.parallel(
      'html:dev',
      'sass:dev',
      'js:dev',
      'images:dev',
      'avif:dev',
      'webp:dev',
      'svg:dev',
      'fonts:dev',
      'files:dev'
    ),
    gulp.parallel('server:dev', 'watch:dev')
  )
);

gulp.task(
  'prod',
  gulp.series(
    'clean:prod',
    gulp.parallel(
      'html:prod',
      'sass:prod',
      'js:prod',
      'images:prod',
      'avif:prod',
      'webp:prod',
      'svg:prod',
      'fonts:prod',
      'files:prod'
    ),
    gulp.parallel('server:prod')
  )
);
