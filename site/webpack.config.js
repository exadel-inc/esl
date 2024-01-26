const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'localdev': './src/localdev.ts',
    'polyfill': './src/polyfill.ts'
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
    removeAvailableModules: true,
    splitChunks: false
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
};
