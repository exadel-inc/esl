const gulp = require('gulp');

const named = require('vinyl-named');
const webpackStream = require('webpack-stream');

const OPTIONS_DEFAULT = {
  watch: false,
  check: true
};

function buildConfig(config) {
  config = Object.assign({}, OPTIONS_DEFAULT, config);
  const webpackConfig = Object.assign({}, {
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
            'components/**/*.ts'
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

  if (config.check) {
    const ESLintPlugin = require('eslint-webpack-plugin');
    webpackConfig.plugins.push(new ESLintPlugin({
      context: 'components',
      extensions: 'ts',
      formatter: 'unix',
      emitWarning: true
    }));
  }

  return webpackConfig;
}

module.exports.buildTsBundle = (config, out) => function buildTsLocal() {
  return gulp.src(config.src)
    .pipe(named(config.nameFunction))
    .pipe(webpackStream(buildConfig(config)))
    .pipe(gulp.dest(out));
};
