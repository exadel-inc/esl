const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'localdev': './src/localdev.ts',
    'polyfill-full': './src/polyfill-full.ts',
    'polyfill-light': './src/polyfill-light.ts'
  },
  resolve: {
    modules: ['../node_modules'],
    roots: [],
    extensions: ['.ts', '.js']
  },
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
  output: {
    path: path.resolve(__dirname, 'static/bundles'),
    filename: '[name].js'
  }
};
