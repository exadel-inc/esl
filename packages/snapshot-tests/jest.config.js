import {EventEmitter} from 'events';
import {rimraf} from 'rimraf';

// Test env in dev mode produces a big amount of stdin/out listeners, so limit increased
EventEmitter.defaultMaxListeners = 50;

// Cleanup diff output directory
rimraf.sync('./.diff');

// Actual Jest configuration
export default {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.(j|t)sx?$': '@swc/jest',
    '^.+\\.feature$': './src/transformer/gherkin.js'
  },
  transformIgnorePatterns: [
    "/node_modules/(?!pixelmatch)"
  ],
  extensionsToTreatAsEsm: ['.tsx', '.jsx'],
  roots: ['./tests/'],
  testRegex: ['(.+)\\.(spec|test)\\.ts$', '(.+).feature'],
  moduleFileExtensions: ['ts', 'js', 'feature'],
  setupFilesAfterEnv: ['./src/serializers/image-snapshot.ts', './src/scenarios.ts'],
  reporters: [
    ['./src/reporters/reporter.js', {
      diffDir: './.diff',
      outputPath: './.diff/README.md',
      outputPublishPath: './.diff/index.md'
    }],
    ['github-actions', {silent: false}],
    'default'
  ]
};
