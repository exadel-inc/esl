module.exports = {
  // runner: 'jest-electron/runner',
  // testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  roots: ['components'],
  testRegex: '/(.+).test\\.ts$',
  coverageDirectory: '.coverage',
  coverageReporters: ['lcov', 'html'],
  collectCoverageFrom: [
    'components/**/*.ts',
    // cumulative exclude
    '!components/*.ts',
    '!components/*/*.ts',
    // libs exclude
    '!**/node_modules/**'
  ]
};
