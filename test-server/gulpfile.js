const gulp = require('gulp');
const cfg = require('./paths.json');

const {buildTsBundle} = require('./build/webpack-task');

const {print} = require('../build/common');
const {cleanAll} = require('../build/clean-task');
const {lessBuild} = require('../build/less-task');
const {lintTS, lintCSS} = require('../gulpfile');

// === BUILD TASKS ===
const buildLocalTs = buildTsBundle({
  src: cfg.server.ts
}, cfg.server.target);
const buildLocalLess = lessBuild(cfg.server.less, cfg.server.target);
const buildLocal = gulp.series(
  print('=== Running ESL Demo Server Build ==='),
  cleanAll(cfg.server.target),
  gulp.parallel(
    buildLocalTs,
    buildLocalLess
  )
);

const watchLess = gulp.series(buildLocalLess, function watchLess() {
  gulp.watch(cfg.watch.less, {},
    gulp.series(print('LESS Changed ...'), buildLocalLess, lintCSS)
  );
});
const watchTs = buildTsBundle({
  src: cfg.server.ts,
  watch: true
}, cfg.server.target);
const watchTsLint = function watchTsLint() {
  gulp.watch(cfg.watch.ts, {},
    gulp.series(print('TS Changed ...'), lintTS)
  );
};

const watchLocal = gulp.parallel(watchLess, watchTs, watchTsLint);

const serverSketch = require('@exadel/server-sketch/localdev');
const startServer = (done) => {
  serverSketch.start(require('./config'));
  done();
};
const start = gulp.series(startServer, watchLocal);

module.exports = {
  start,
  startServer,
  watchLocal,
  buildLocal,
  buildLocalTs,
  buildLocalLess
};
