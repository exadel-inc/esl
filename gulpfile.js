const gulp = require('gulp');
const cfg = require('./paths.json');

const {cleanAll} = require('./build/clean-task');
const {tscBuild} = require('./build/tsc-task');
const {lessCopy, lessBuildProd} = require('./build/less-task');

// === BUILD TASKS ===
const buildModules = tscBuild({src: cfg.src.ts, base: cfg.src.base}, cfg.src.dest);
const buildPolyfills = tscBuild({src: cfg.polyfills.ts, base: cfg.polyfills.base}, cfg.polyfills.dest);
const buildLess = lessCopy({src: cfg.src.less, base: cfg.src.base}, cfg.src.dest);
const buildCss = lessBuildProd({src: cfg.src.css, base: cfg.src.base}, cfg.src.dest);

const clean = cleanAll([...cfg.src.destPaths, ...cfg.polyfills.destPaths]);
const build = gulp.series(clean, gulp.parallel(buildModules, buildPolyfills, buildLess, buildCss));

module.exports = {
  build,
  clean
};
