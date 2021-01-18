const gulp = require('gulp');
const cfg = require('./paths.json');

const {print} = require('../build/common');
const {cleanAll} = require('../build/clean-task');
const {lessBuild} = require('../build/less-task');
const {lintTS, lintCSS} = require('../gulpfile');

const webpack = require('webpack');
const webpackCfg = require('./webpack.config');
const webpackInstance = webpack(webpackCfg);

// === BUILD TASKS ===
const buildLocalTs = ((cb) => {
  webpackInstance.run(() => cb());
});
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

const watchSources = function watchTsLint() {
  gulp.watch(cfg.watch.ts, {},
    gulp.series(print('TS Changed ...'), lintTS)
  );
  webpackInstance.watch({}, (err, stats) => {
    console.log(stats.toString({
      chunks: false,  // Makes the build much quieter
      colors: true    // Shows colors in the console
    }));
  });
};

const watchLocal = gulp.parallel(watchLess, watchSources);

module.exports = {
  watchLocal,
  buildLocal,
  buildLocalTs,
  buildLocalLess
};
