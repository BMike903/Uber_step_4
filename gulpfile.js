const gulp = require("gulp");
const browserSync = require("browser-sync");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const del = (patterns) =>
  import("del").then((mod) => mod.deleteAsync(patterns));

gulp.task("server", function () {
  browserSync({
    server: {
      baseDir: "src",
    },
  });

  gulp.watch("src/*.html").on("change", browserSync.reload);
});

gulp.task("styles", function () {
  return gulp
    .src("src/sass/**/*.+(scss|sass)")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(gulp.dest("src/css"))
    .pipe(browserSync.stream());
});

gulp.task("watch", function () {
  gulp.watch("src/sass/**/*.+(scss|sass)", gulp.parallel("styles"));
});

gulp.task("default", gulp.parallel("watch", "server", "styles"));

//build
gulp.task("clean", function () {
  return del(["dist/**", "!dist"]);
});

gulp.task("html", function () {
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

gulp.task("css", function () {
  return gulp.src("src/css/*.min.css").pipe(gulp.dest("dist/css"));
});

gulp.task("assets", function () {
  return gulp
    .src(["src/icons/**/*", "src/img/**/*"], { base: "src", encoding: false })
    .pipe(gulp.dest("dist"));
});

gulp.task(
  "build",
  gulp.series("clean", "styles", gulp.parallel("html", "css", "assets"))
);
