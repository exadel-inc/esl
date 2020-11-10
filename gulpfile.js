const gulp = require('gulp');
const cfg = require('./paths.json');

const {cleanAll} = require('./build/clean-task');
const {tscBuild} = require('./build/tsc-task');
const {tarBuild} = require('./build/tar-task');
const {buildTsBundle} = require('./build/webpack-task');
const {lessBuild, lessBuildProd} = require('./build/less-task');
const {print, catLog} = require('./build/common');
const {lintStyle, lintTypeScript} = require('./build/linting-task');

print('=== Running ESL Build ===')();

// === BUILD TASKS ===
const clean = cleanAll([...cfg.src.destPaths, ...cfg.polyfills.destPaths]);
const build = gulp.series(
  clean,
  gulp.parallel(
    tscBuild({src: cfg.src.ts, base: cfg.src.base}, cfg.src.dest),
    lessBuildProd({src: cfg.src.less, base: cfg.src.base}, cfg.src.dest),
    tscBuild({src: cfg.polyfills.ts, base: cfg.polyfills.base}, cfg.polyfills.dest)
  )
);

const tar = gulp.series(cleanAll(cfg.tar.destPaths), build, tarBuild(cfg.tar.dest));

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
