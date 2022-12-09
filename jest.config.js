module.exports = {
  transform: {
    '^.+\\.tsx?$': ['ts-jest']
  },
  testEnvironment: 'jsdom',
  roots: ['src/modules', 'src/polyfills'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: '.report',
  coverageReporters: ['lcov', 'html'],
  setupFiles: [
    './src/modules/esl-utils/test/deviceDetector.mock.ts',
    './src/modules/esl-utils/test/matchMedia.mock.ts'
  ],
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
