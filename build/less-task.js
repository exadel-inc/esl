const gulp = require('gulp');
const paths = require('../paths');

// STYLES
const less = require('gulp-less');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');

// UTILS
const sourcemaps = require('gulp-sourcemaps');

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

const lessBundle = require('./common/lessbundle');

function buildLess(src, sourceMaps = true) {
  let files = gulp.src(src);
  files = sourceMaps ? files.pipe(sourcemaps.init()) : files;
  files = files.pipe(less());
  files = files.pipe(postcss([
    autoprefixer(),
    cssnano()
  ]));
  files = sourceMaps ? files.pipe(sourcemaps.write('/')) : files;
  return files;
}

module.exports.default = buildLess;

module.exports.buildLessLib = function buildLessLib() {
  return buildLess(paths.bundle.less)
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(paths.bundle.target));
};

module.exports.buildLessLocal = function buildLessLocal() {
  return buildLess(paths.test.less).pipe(gulp.dest(paths.test.target));
};

module.exports.buildLessBundles = function buildLessBundles() {
  return lessBundle(paths.bundle.lessComponents)
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(paths.bundle.target));
};

module.exports.buildLessBundlesDefaults = function buildLessBundles() {
  return buildLess(paths.bundle.lessComponentsDefaults, false)
    .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(paths.bundle.target));
};
