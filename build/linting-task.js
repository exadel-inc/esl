const gulp = require('gulp');
const path = require('path');
const root = path.resolve(__dirname, './..');

const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

module.exports.lintTypeScript = (src) => {
  return function lintTypeScript() {
    return gulp.src(src)
      .pipe(eslint(path.join(root, '.eslintrc.json')))
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
          {formatter: 'json', save: path.join(root, '.report/stylelint-report.json')}
        ]
      }));
  };
};
