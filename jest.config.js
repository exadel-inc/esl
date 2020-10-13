module.exports = {
  // runner: 'jest-electron/runner',
  // testEnvironment: 'jest-electron/environment',
  preset: 'ts-jest',
  roots: ['components'],
  testRegex: "/(.+).test\\.ts$",
  coverageReporters: ['html']
};
