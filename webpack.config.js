import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'playground': './src/playground.ts',
    'playground.run': './src/registration.ts'
  },
  resolve: {
    roots: [],
    extensions: ['.ts', '.js']
  },
  module: {
    noParse: [
      /\/brace\//
    ],
    rules: [{
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          target: 'ES6',
          declaration: true
        }
      }
    }, {
      test: /\.less$/i,
      type: 'asset/resource',
      use: [
        'less-loader',
        'postcss-loader'
      ]
    }]
  },
  output: {
    library: {
      root: 'UIP',
      amd: 'uip',
      commonjs: 'uip',
    },
    libraryTarget: 'umd',
    path: resolve(__dirname, 'lib'),
    filename: '[name].js',
    assetModuleFilename: '[name].css'
  }
};
