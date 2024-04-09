const path = require('path');

const BASE_CONFIG = {
  mode: 'development',
  devtool: 'source-map',
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
};

module.exports = [{
  ...BASE_CONFIG,
  entry: {
    'localdev': './src/localdev.ts',
    'polyfill-full': './src/polyfill-full.ts',
    'polyfill-medium': './src/polyfill-medium.ts',
    'polyfill-light': './src/polyfill-light.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
}, {
  ...BASE_CONFIG,
  entry: {
    'lib': './src/playground/export/lib.ts',
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js',
    library: {
      type: 'module'
    }
  }
}];
