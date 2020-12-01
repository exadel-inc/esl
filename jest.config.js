module.exports = {
  // runner: 'jest-electron/runner',
  // testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  roots: ['src/modules'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  collectCoverageFrom: [
    'src/modules/**/*.ts',
    // cumulative exclude
    '!src/modules/*.ts',
    '!src/modules/*/*.ts',
    // beta modules exclude
    '!src/modules/beta/**',
    // libs exclude
    '!**/node_modules/**'
  ]
};
