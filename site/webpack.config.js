const path = require('path');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'playground': './src/playground.ts'
  },
  resolve: {
    modules: ['../node_modules'],
    roots: [],
    extensions: ['.ts', '.js', '.tsx']
  },
  module: {
    rules: [
    {
      test: /\.(tsx?)$/,
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
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'dev.stats.json',
      reportFilename: 'dev.report.html'
    })
  ]
};
