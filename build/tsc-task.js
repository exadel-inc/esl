const path = require('path');
const gulp = require('gulp');
const {srcExt} = require('./common');

const ts = require('gulp-typescript');

const configPath = path.join(__dirname, './../tsconfig.json');

module.exports.tscBuild = (config, src, out) => {
  const tsProject = ts.createProject(configPath, Object.assign({
    declaration: true
  }, config));
  return function tsc() {
    return srcExt(src)
      .pipe(tsProject())
      .pipe(gulp.dest(out));
  };
};
