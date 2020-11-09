const path = require('path');
const gulp = require('gulp');

const ts = require('gulp-typescript');

const configPath = path.join(__dirname, './../tsconfig.json');

module.exports.tscBuild = (config, src, out) => {
  const tsProject = ts.createProject(configPath, Object.assign({
    declaration: true
  }, config));
  return function tsc() {
    return gulp.src(src, {base: './modules/'})
      .pipe(tsProject())
      .pipe(gulp.dest(out));
  };
};
