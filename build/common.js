const gulp = require('gulp');

function print(...logArgs) {
  return (cb) => {
    console.log(...logArgs);
    (typeof cb === 'function') && cb();
  };
}
module.exports.print = print;

module.exports.srcExt = function (src) {
  if (typeof src === 'string' || Array.isArray(src)) {
    return gulp.src(src);
  }
  const options = Object.assign({}, src);
  delete options.src;
  return gulp.src(src.src, options);
}

