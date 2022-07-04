module.exports = {
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  roots: ['src/modules'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  setupFiles: [
    './src/modules/esl-utils/test/deviceDetector.mock.ts',
    './src/modules/esl-utils/test/matchMedia.mock.ts'
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  collectCoverageFrom: [
    'src/modules/**/*.ts',
    // test dir
    '!src/**/test/*.ts',
    // cumulative exclude
    '!src/modules/*.ts',
    '!src/modules/*/*.ts',
    // beta modules exclude
    '!src/modules/beta/**',
    // libs exclude
    '!**/node_modules/**'
  ]
};
