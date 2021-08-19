import {resolve, dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

//TODO: optimize build
const lessLoaderConf = {
  test: /\.less$/i,
  type: 'asset/resource',
  use: [
    'less-loader',
    /*'postcss-loader'*/
  ]
};

const tsToEs6Loader = {
  test: /\.ts$/,
  loader: 'ts-loader',
  options: {
    compilerOptions: {
      target: 'ES6',
      declaration: true
    },
  }
};

const tsToEs5Loader = {
  test: /\.(ts|js)$/,
  exclude: /node_modules\/(?!@exadel\/esl)/,
  loader: 'ts-loader',
  options: {
    compilerOptions: {
      target: 'ES5',
      declaration: true
    },
  }
};

const output = {
  library: {
    root: 'UIP',
    amd: 'uip',
    commonjs: 'uip',
  },
  libraryTarget: 'umd',
  path: resolve(__dirname, 'lib'),
  filename: '[name].js',
  assetModuleFilename: 'playground.css'
};

const baseConf = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'playground': './src/registration.ts',
    'playground.run': './src/playground.ts',
  },
  resolve: {
    roots: [],
    extensions: ['.ts', '.js']
  }
};

export default [
  Object.assign({}, baseConf, {
    module: {
      rules: [tsToEs6Loader, lessLoaderConf]
    },
    output: Object.assign({}, output)
  })
]
