const gulp = require('gulp');
const clean = require('gulp-clean');

module.exports.clean = (src) => function cleanTask() {
  return gulp.src(src, {read: false, allowEmpty: true}).pipe(clean({force: true}));
};
