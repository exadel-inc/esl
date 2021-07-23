const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

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
  plugins: [new MiniCssExtractPlugin()],
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
    },
    {
      test: /\.css$/i,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
            output: {
              comments: false,
            },
        },
        extractComments: false,
      }), 
      new CssMinimizerPlugin({
        minimizerOptions: {
            preset: [
                'default',
                {
                  discardComments: { removeAll: true },
                },
            ],
          },
      })
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/bundles'),
    filename: '[name].js'
  }
};
