import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';
import rspack from '@rspack/core';
import {RsdoctorRspackPlugin} from '@rsdoctor/rspack-plugin';

const PWD = dirname(fileURLToPath(import.meta.url));

const RSDOCTOR = !!process.env.RSDOCTOR;

const RSDOCTOR_PLUGIN = RSDOCTOR ? [new RsdoctorRspackPlugin({
  disableClientServer: true,
  output: {
    reportDir: resolve(PWD, 'report'),
    mode: 'brief',
    options: {
      type: ['html', 'json'],
    }
  }
})] : [];

const BASE_CONFIG = {
  mode: 'development',
  devtool: 'source-map',
  resolve: {
    modules: ['../../node_modules'],
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
    splitChunks: false,
    minimize: true,
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin()
    ]
  },
  plugins: [
    ...RSDOCTOR_PLUGIN
  ],
};

export default [{
  ...BASE_CONFIG,
  entry: {
    'site': './src/site.ts',
    'polyfill': './src/polyfill.ts'
  },
  output: {
    path: resolve(PWD, 'dist/bundles'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }
}, {
  ...BASE_CONFIG,
  entry: {
    'lib': './src/lib.ts',
  },
  experiments: {
    outputModule: true,
  },
  output: {
    path: resolve(PWD, 'dist/bundles'),
    filename: '[name].js',
    library: {
      type: 'module'
    }
  }
}];
