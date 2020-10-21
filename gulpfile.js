const gulp = require('gulp');
const cfg = require('./paths.json');

const {tscBuild} = require('./build/tsc-task');
const {lessCopy, lessBuild} = require('./build/less-task');
const {print, printBuildStart} = require('./build/common');
const {buildTsBundle} = require('./build/webpack-task');

const {clean} = require('./build/clean-task');

printBuildStart();

// === BUILD TASKS ===
const build = gulp.series(
  clean(['components-es5/*', 'components-es6/*']),
  gulp.parallel(
    tscBuild({target: 'es5'}, cfg.src.ts, 'components-es5'),
    tscBuild({target: 'es6'}, cfg.src.ts, 'components-es6'),
    lessCopy(cfg.src.less, ['components-es5', 'components-es6']),
    lessBuild(cfg.src.css, ['components-es5', 'components-es6'])
  )
);

// === Local Build ===
const buildLocalTs = buildTsBundle({
  src: cfg.test.ts
}, cfg.test.target);
const buildLocalLess = lessBuild(cfg.test.less, cfg.test.target);
const buildLocal = gulp.series(
  clean(cfg.test.target),
  gulp.parallel(
    buildLocalTs,
    buildLocalLess
  )
);

const watchLess = gulp.series(buildLocalLess, function watchLess() {
  gulp.watch(cfg.watch.less, {},
    gulp.series(print('LESS Changed ...'), buildLocalLess)
  );
});
const watchTs = buildTsBundle({
  src: cfg.test.ts,
  watch: true
}, cfg.test.target);

const watchLocal = gulp.parallel(watchLess, watchTs);

module.exports = {
  clean,
  build,
  watchLocal,
  buildLocal,
  buildLocalTs,
  buildLocalLess
};
