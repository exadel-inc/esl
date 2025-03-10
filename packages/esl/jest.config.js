module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  roots: ['src'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  setupFiles: [
    './src/esl-utils/test/deviceDetector.mock.ts',
    './src/esl-utils/test/matchMedia.mock.ts',
    './src/esl-utils/test/resizeObserver.mock.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    // test dir
    '!src/**/test/*.ts',
    // cumulative exclude
    '!src/*.ts',
    '!src/*/*.ts',
    // libs exclude
    '!**/node_modules/**'
  ]
};
