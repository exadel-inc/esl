import { defineConfig } from 'vitest/config';

const isCI = process.env.CI === 'true';
const collectCoverage = process.env.TEST_COVERAGE !== 'false';

export default defineConfig({
  test: {
    // Jest-like globals
    globals: true,
    // Environment
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      }
    },
    // Test file patterns (equivalent to Jest's testRegex)
    include: ['**/test/**/*.test.ts'],
    // Setup files (equivalent to Jest's setupFiles)
    setupFiles: [
      './src/esl-utils/test/deviceDetector.mock.ts',
      './src/esl-utils/test/matchMedia.mock.ts',
      './src/esl-utils/test/resizeObserver.mock.ts',
      './src/esl-utils/test/timer.mock.ts'
    ],
    // Coverage configuration
    coverage: {
      enabled: collectCoverage,
      provider: 'v8',
      reporter: isCI ? [['lcov', { projectRoot: '../..' }]] : ['html'],
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
