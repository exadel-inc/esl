const gulp = require('gulp');

const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

module.exports.lintTypeScript = (src) => {
  return function lintTypeScript() {
    return gulp.src(src)
      .pipe(eslint('.eslintrc.json'))
      .pipe(eslint.format('unix', console.warn))
      .pipe(eslint.failAfterError());
  };
};

module.exports.lintStyle = (src) => {
  return function lintStyles() {
    return gulp.src(src)
      .pipe(stylelint({
        reporters: [
          {formatter: 'string', console: true},
          {formatter: 'json', save: '.report/stylelint-report.json'}
        ]
      }));
  };
};
