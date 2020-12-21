const gulp = require('gulp');

const bs = require('browser-sync');
const named = require('vinyl-named');
const webpackStream = require('webpack-stream');

function buildConfig(config = {}) {
  return Object.assign({}, {
    watch: !!config.watch,
    devtool: 'source-map',
    module: {
      rules: [{
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            target: 'ES5',
            declaration: false
          }
        }
      }]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    mode: 'development',
    plugins: []
  });
}

module.exports.buildTsBundle = (config, out) => function buildTsLocal() {
  return gulp.src(config.src)
    .pipe(named(config.nameFunction))
    .pipe(webpackStream(buildConfig(config), null, function(err, stats) {
      try {
        bs.get('server-sketch').reload();
        console.info('BS force updated via webpack build');
      } catch {
        console.debug('Can\'t update BS instance');
      }
    }))
    .pipe(gulp.dest(out));
};
