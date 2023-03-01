module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.html?$': './build/jest.html-loader.js'
  },
  testEnvironment: 'jsdom',
  roots: ['src/modules', 'src/polyfills'],
  testRegex: '/test/(.+)\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
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
    // draft modules exclude
    '!src/modules/draft/**',
    // libs exclude
    '!**/node_modules/**'
  ]
};
