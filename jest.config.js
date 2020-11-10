module.exports = {
  // runner: 'jest-electron/runner',
  // testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  roots: ['modules'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ["ts", "js", "json"], // Prefer ts sources over js
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  collectCoverageFrom: [
    'modules/**/*.ts',
    // cumulative exclude
    '!modules/*.ts',
    '!modules/*/*.ts',
    // beta modules exclude
    '!modules/beta/**',
    // libs exclude
    '!**/node_modules/**'
  ]
};
