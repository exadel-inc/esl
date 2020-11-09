const gulp = require('gulp');

// STYLES
const less = require('gulp-less');
const postcss = require('gulp-postcss');

// UTILS
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports.lessBuild = (src, out) => function lessBuild() {
  return gulp.src(src, {base: './modules/'})
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(out));
};

module.exports.lessBuildProd = (src, out) => function lessBuildProd() {
  return gulp.src(src, {base: './modules/'})
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest(out))
    .pipe(postcss([cssnano()]))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(out));
};
