const gulp = require('gulp');

const {
  printBuildStart
} = require('./build/config');
const {
  clean,
  cleanLocal
} = require('./build/clean-task');
const {
  buildLessLib,
  buildLessLocal,
  buildLessBundles,
  buildLessBundlesDefaults
} = require('./build/less-task');
const {
  buildTsLib,
  buildTsLocal,
  buildTsBundles
} = require('./build/webpack-task');
const {
  watch
} = require('./build/watch-task');

// === BUILD TASKS ===
const buildLib = gulp.parallel(buildLessLib, buildTsLib);
const buildLocal = gulp.series(cleanLocal, gulp.parallel(buildLessLocal, buildTsLocal));
const buildGranular = gulp.parallel(buildTsBundles, buildLessBundles, buildLessBundlesDefaults);
const build = gulp.series(clean, buildLib);
const prepare = gulp.series(buildLib, buildGranular);

printBuildStart();

module.exports = {
  clean,
  build,
  watch,
  prepare,
  buildLib,
  buildGranular,
  buildLocal
};
