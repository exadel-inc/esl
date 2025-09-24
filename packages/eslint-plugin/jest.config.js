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
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage,
  coverageReporters,
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
};
