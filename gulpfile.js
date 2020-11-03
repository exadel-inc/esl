const gulp = require('gulp');
const cfg = require('./paths.json');

const {clean} = require('./build/clean-task');
const {tscBuild} = require('./build/tsc-task');
const {tarBuild} = require('./build/tar-task');
const {buildTsBundle} = require('./build/webpack-task');
const {lessBuild} = require('./build/less-task');
const {print, catLog} = require('./build/common');
const {lintStyle, lintTypeScript} = require('./build/linting-task');

print('=== Running ESL Build ===')();

// === BUILD TASKS ===
const build = gulp.series(
  clean(['modules-es5/*', 'modules-es6/*']),
  gulp.parallel(
    tscBuild({target: 'es5'}, cfg.src.ts, 'modules-es5'),
    tscBuild({target: 'es6'}, cfg.src.ts, 'modules-es6'),
    lessBuild(cfg.src.less, ['modules-es5', 'modules-es6'])
  )
);

const tar = gulp.series(clean('target/*'), build, tarBuild());

// === LINTER TASKS ===
const lintTS = lintTypeScript(cfg.lint.ts);
const lintCSS = lintStyle(cfg.lint.less)
const lint = gulp.series(gulp.parallel(lintTS, lintCSS), catLog('Linting passed'));

// === Local Build ===
const buildLocalTs = buildTsBundle({
  src: cfg.server.ts
}, cfg.server.target);
const buildLocalLess = lessBuild(cfg.server.less, cfg.server.target);
const buildLocal = gulp.series(
  clean(cfg.server.target),
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

module.exports = {
  tar,
  lint,
  clean,
  build,
  watchLocal,
  buildLocal,
  buildLocalTs,
  buildLocalLess
};
