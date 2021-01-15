const gulp = require('gulp');
const cfg = require('./paths.json');

const {cleanAll} = require('./build/clean-task');
const {tscBuild} = require('./build/tsc-task');
const {lessCopy, lessBuildProd} = require('./build/less-task');
const {catLog} = require('./build/common');
const {lintStyle, lintTypeScript} = require('./build/linting-task');

// === BUILD TASKS ===
const buildModules = tscBuild({src: cfg.src.ts, base: cfg.src.base}, cfg.src.dest);
const buildPolyfills = tscBuild({src: cfg.polyfills.ts, base: cfg.polyfills.base}, cfg.polyfills.dest);
const buildLess = lessCopy({src: cfg.src.less, base: cfg.src.base}, cfg.src.dest);
const buildCss = lessBuildProd({src: cfg.src.css, base: cfg.src.base}, cfg.src.dest);

const clean = cleanAll([...cfg.src.destPaths, ...cfg.polyfills.destPaths]);
const build = gulp.series(clean, gulp.parallel(buildModules, buildPolyfills, buildLess, buildCss));

// === LINTER TASKS ===
const lintTS = lintTypeScript(cfg.lint.ts);
const lintCSS = lintStyle(cfg.lint.less)
const lint = gulp.series(gulp.parallel(lintTS, lintCSS), catLog('Linting passed'));

module.exports = {
  lint,
  lintTS,
  lintCSS,
  build,
  clean
};
