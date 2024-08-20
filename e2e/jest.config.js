// Test env in dev mode produces a big amount of stdin/out listeners, so limit increased
require('events').EventEmitter.defaultMaxListeners  = 50;

// Cleanup diff output directory
const rimraf = require('rimraf');
rimraf.sync('./.diff');

// Actual Jest configuration
module.exports = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.feature$': './transformer/gherkin.js'
  },
  roots: ['./tests/'],
  testRegex: ['(.+)\\.(spec|test)\\.ts$', '(.+).feature'],
  moduleFileExtensions: ['ts', 'js', 'feature'],
  setupFilesAfterEnv: ['./setup/serializers/image.ts', './setup/scenarios.ts'],
  reporters: [
    ['./reporters/reporter.js', {
      diffDir: './.diff',
      outputPath: './.diff/README.md',
      outputPublishPath: './.diff/index.md'
    }],
    ['github-actions', {silent: false}],
    'default'
  ]
};
