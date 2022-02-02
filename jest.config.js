module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  roots: ['packages'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  setupFiles: [
    './packages/esl-utils/src/test/deviceDetector.mock.ts',
    './packages/esl-utils/src/test/matchMedia.mock.ts'
  ],
  collectCoverageFrom: [
    'packages/**/*.ts',
    // test dir
    '!packages/**/test/*.ts',
    // cumulative exclude
    '!packages/*/src/*.ts',
    // beta modules exclude
    '!packages/draft/**',
    // libs exclude
    '!**/node_modules/**'
  ]
};
