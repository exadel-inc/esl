const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'playground': './src/playground.ts'
  },
  resolve: {
    modules: ['../node_modules'],
    roots: [],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
    {
      test: /\.ts$/,
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          target: 'ES6',
          declaration: true
        },
      }
    },]
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js'
  }
};
