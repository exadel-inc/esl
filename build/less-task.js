const gulp = require('gulp');

// STYLES
const less = require('gulp-less');
const postcss = require('gulp-postcss');

// UTILS
const sourcemaps = require('gulp-sourcemaps');

// POSTCSS PLUGINS
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

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

const multiDist = (inpStream, outs) => [].concat(outs).reduce(
    (stream, out) => stream.pipe(gulp.dest(out)),
    inpStream
);

module.exports.lessCopy = (src, outs) => function lessCopy() {
  return multiDist(gulp.src(src), outs);
};
module.exports.lessBuild = (src, outs) => function lessBuild() {
  return multiDist(buildLess(src), outs);
};
