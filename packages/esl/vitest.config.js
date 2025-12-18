import {defineConfig} from 'vitest/config';

const isCI = process.env.CI === 'true';
const collectCoverage = process.env.TEST_COVERAGE !== 'false';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      }
    },
    include: ['**/test/**/*.test.ts'],
    setupFiles: [
      './src/esl-utils/test/deviceDetector.mock.ts',
      './src/esl-utils/test/matchMedia.mock.ts',
      './src/esl-utils/test/resizeObserver.mock.ts',
      './src/esl-utils/test/timer.mock.ts'
    ],
    coverage: {
      enabled: collectCoverage,
      provider: 'v8',
      reporter: isCI ? [['lcov', {projectRoot: '../..'}]] : ['html'],
      include: [
        'src/**/*.ts',
        // test dir
        '!src/**/test/*.ts',
        // cumulative exclude
        '!src/*.ts',
        '!src/*/*.ts',
        // libs exclude
        '!**/node_modules/**'
      ],
    },
  },
});
