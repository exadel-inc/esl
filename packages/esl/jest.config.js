const isCI = process.env.CI === 'true';
const collectCoverage = process.env.TEST_COVERAGE !== 'false';
const coverageReporters = [];
if (isCI) {
  coverageReporters.push(['lcov', { projectRoot: '../..' }]);
} else {
  coverageReporters.push('html');
}

module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testEnvironment: 'jsdom',
  roots: ['src'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
  setupFiles: [
    './src/esl-utils/test/deviceDetector.mock.ts',
    './src/esl-utils/test/matchMedia.mock.ts',
    './src/esl-utils/test/resizeObserver.mock.ts'
  ],
  collectCoverage,
  coverageReporters,
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
