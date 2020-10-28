const gulp = require('gulp');

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
            target: 'ES5'
          },
          reportFiles: [
            'modules/**/*.ts'
          ]
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
    .pipe(webpackStream(buildConfig(config)))
    .pipe(gulp.dest(out));
};
