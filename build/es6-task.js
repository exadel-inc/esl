const path = require('path');
const gulp = require('gulp');

const named = require('vinyl-named');
const ts = require('gulp-typescript');
const rename = require('gulp-rename');

const TS_CONFIG = path.join(__dirname, '../tsconfig.json');

module.exports.buildES6 = function tsBuildES6(config) {
  var tsProject = ts.createProject(TS_CONFIG, {
    outDir: 'lib-es6',
    target: 'es6',
    removeComments: false
  });
  return gulp.src(config.src)
    .pipe(named(config.nameFunction))
    .pipe(tsProject())
    .pipe(rename((path) => {
      if (path.extname === '.js') {
        path.extname = '.es6';
      }
    }));
};
