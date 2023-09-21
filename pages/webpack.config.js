const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'localdev': './src/localdev.ts',
    'polyfill-full': './src/polyfill-full.ts',
    'polyfill-medium': './src/polyfill-medium.ts',
    'polyfill-light': './src/polyfill-light.ts'
  },
  resolve: {
    modules: ['../node_modules'],
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
  watchOptions: {
    aggregateTimeout: 200
  },
  optimization: {
    concatenateModules: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
};
