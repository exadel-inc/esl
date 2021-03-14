import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, 'dist');

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
    rules: [{
      test: /\.(js|ts)$/,
      loader: 'ts-loader',
      options: {
        compilerOptions: {
          target: 'ES6',
          declaration: false
        }
      }
    }, {
      test: /\.less$/i,
      type: 'asset/resource',
      use: [
        { loader: 'less-loader' },
        { loader: 'postcss-loader' }
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
    path: outDir,
    filename: '[name].js',
    assetModuleFilename: '[name].css'
  },
  experiments: {
    asset: true
  }
};
