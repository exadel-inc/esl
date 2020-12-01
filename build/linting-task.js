const gulp = require('gulp');
const path = require('path');
const root = path.resolve(__dirname, './..');

const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');

module.exports.lintTypeScript = (src, base) => {
  return function lintTypeScript() {
    return gulp.src(src, {base})
      .pipe(eslint(path.join(root, '.eslintrc.json')))
      .pipe(eslint.format('unix', console.warn))
      .pipe(eslint.failAfterError());
  };
};

module.exports.lintStyle = (src, base) => {
  return function lintStyles() {
    return gulp.src(src, {base})
      .pipe(stylelint({
        reporters: [
          {formatter: 'string', console: true},
          {formatter: 'json', save: path.join(root, '.report/stylelint-report.json')}
        ]
      }));
  };
};
