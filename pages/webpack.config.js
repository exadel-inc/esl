const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'localdev': './src/localdev.ts',
    'polyfill-full': './src/polyfill-full.ts',
    'polyfill-medium': './src/polyfill-medium.ts',
    'polyfill-light': './src/polyfill-light.ts',
    'ui-playground': './src/ui-playground/ui-playground.ts',
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
          declaration: false
        }
      }
    }]
  },
  optimization: {
    concatenateModules: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js'
  }
};
