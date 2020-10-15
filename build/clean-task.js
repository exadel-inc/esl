const gulp = require('gulp');
const paths = require('../paths');
const clean = require('gulp-clean');

function cleanPath(config) {
  return gulp.src(config.src, {read: false, allowEmpty: true})
    .pipe(clean({force: true}));
}

module.exports.default = cleanPath;

module.exports.clean = function cleanLib() {
  return cleanPath({
    src: [paths.bundle.target].map((path) => `${path}/`)
  });
}
module.exports.cleanLocal = function cleanLocal() {
  return cleanPath({
    src: `${paths.test.target}/`
  });
}
