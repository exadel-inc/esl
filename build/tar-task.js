const path = require('path');
const gulp = require('gulp');

const gulpTar = require('gulp-tar');
const gulpGzip = require('gulp-gzip');
const gulpPrint = require('gulp-print').default;
const gulpIgnore = require('gulp-exclude-gitignore');

const root = path.resolve(__dirname, './..');
const ignoreFile = path.join(root, '.npmignore');
const tarPackageName = 'esl';

module.exports.tarBuild = (dest) => {
  return function buildTar() {
    return gulp.src('./**/*', {base: root, ignore: ['node_modules/**/*']})
      .pipe(gulpIgnore(ignoreFile))
      .pipe(gulpPrint((filepath) => `NPM PACKAGE LIST: ${filepath}`))
      .pipe(gulpTar(tarPackageName + '.tar', {prefix: tarPackageName}))
      .pipe(gulp.dest(dest))
      .pipe(gulpGzip())
      .pipe(gulp.dest(dest))
      .on('end', () => console.log(`'${tarPackageName}' PACKAGE CREATED`));
  }
};
