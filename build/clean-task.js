const gulp = require('gulp');
const clean = require('gulp-clean');

module.exports.cleanAll = (src) => function cleanTask() {
  return gulp.src(src, {read: false, allowEmpty: true}).pipe(clean({force: true}));
};
