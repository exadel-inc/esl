// Test env in dev mode produces a big amount of stdin/out listeners, so limit increased
require('events').EventEmitter.defaultMaxListeners  = 50;

module.exports = {
  preset: "jest-puppeteer",
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  roots: ['./tests/'],
  testRegex: '(.+)\\.(spec|test)\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  setupFilesAfterEnv: ['./setup/image.ts'],
};
