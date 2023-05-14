const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const htmlMin = require("gulp-htmlmin");
// const stylus = require("gulp-stylus");
// const less = require("gulp-less");
const size = require("gulp-size");
const newer = require("gulp-newer");
// const pug = require("gulp-pug");
const imagemin = require("gulp-imagemin");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const autoprefixer = require("gulp-autoprefixer");

const del = require("del");

const paths = {
  styles: {
    src: "src/sass/**/*",
    dest: "dist/styles/",
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "dist/scripts/",
  },
  images: {
    src: "src/img/**/*",
    dest: "dist/img/",
  },
  minHtml: {
    src: "src/*.html",
    dest: "dist",
  },
  // gulpPug: {
  //   src: "src/*.pug",
  //   dest: "dist",
  // },
};

function clean() {
  return del(["dist/*", "!dist/img"]);
}

function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(newer(paths.styles.dest))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(size())
    .pipe(concat("main.min.css"))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(newer(paths.scripts.dest))
    .pipe(babel())
    .pipe(uglify())
    .pipe(
      rename({
        basename: "main",
        suffix: ".min",
      })
    )
    .pipe(size())
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest(paths.scripts.dest));
}
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(newer(paths.images.dest))
    .pipe(imagemin())
    .pipe(size())
    .pipe(gulp.dest(paths.images.dest));
}

function minHtml() {
  return gulp
    .src(paths.minHtml.src)
    .pipe(newer(paths.minHtml.dest))
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(size())
    .pipe(gulp.dest(paths.minHtml.dest));
}
// function gulppug() {
//   return gulp
//     .src(paths.gulpPug.src)
//     .pipe(pug())
//     .pipe(size())
//     .pipe(gulp.dest(paths.gulpPug.dest));
// }

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.minHtml.src, minHtml);
  // gulp.watch(paths.gulpPug.src, gulppug);
}
const build = gulp.series(
  clean,
  minHtml,
  gulp.parallel(styles, scripts, images)
  // Указать gulppug следом за images при желании использовать этот шаблонизатор
);

exports.clean = clean;
// exports.gulppug = gulppug;
exports.minHtml = minHtml;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.watch = watch;
exports.default = build;
