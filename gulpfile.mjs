import gulp from "gulp";
import "./gulp/gulp.dev.mjs";
import "./gulp/gulp.prod.mjs";

gulp.task(
  "default",
  gulp.series(
    "clean:dev",
    gulp.parallel(
      "html:dev",
      "sass:dev",
      "js:dev",
      "images:dev",
      "fonts:dev",
      "files:dev"
    ),
    gulp.parallel("server:dev", "watch:dev")
  )
);

gulp.task(
  "prod",
  gulp.series(
    "clean:prod",
    gulp.parallel(
      "html:prod",
      "sass:prod",
      "js:prod",
      "images:prod",
      "fonts:prod",
      "files:prod"
    ),
    gulp.parallel("server:prod", "watch:prod")
  )
);
