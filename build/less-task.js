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

const multiDist = (inpStream, outs) => [].concat(outs).reduce(
    (stream, out) => stream.pipe(gulp.dest(out)),
    inpStream
);

module.exports.lessBuild = (src, outs) => function lessBuild() {
  let files = gulp.src(src);
  files = files.pipe(sourcemaps.init());
  files = files.pipe(less());
  files = files.pipe(postcss([autoprefixer()]));
  files = files.pipe(sourcemaps.write('/'));
  return multiDist(files, outs);
};

module.exports.lessBuildProd = (src, outs) => function lessBuildProd() {
  let files = gulp.src(src)
    .pipe(less())
    .pipe(postcss([autoprefixer()]));
  files = multiDist(files, outs)
      .pipe(postcss([cssnano()]))
      .pipe(rename({suffix: '.min'}));
  return multiDist(files, outs);
};
