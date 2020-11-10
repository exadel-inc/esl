const gulp = require('gulp');
const {srcExt} = require('./common');

const ts = require('gulp-typescript');

module.exports.tscBuild = (src, out, config = {}) => {
  return function tsc() {
    return srcExt(src)
      .pipe(ts.createProject('tsconfig.json', config)())
      .pipe(gulp.dest(out));
  };
};
