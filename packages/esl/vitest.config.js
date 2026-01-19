import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

const isCI = process.env.CI === 'true';
const collectCoverage = process.env.TEST_COVERAGE !== 'false';

const root = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  test: {
    root,
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost/',
      }
    },
    include: ['**/test/**/*.test.ts'],
    setupFiles: [
      './src/test/timer.mock.ts',
      './src/test/deviceDetector.mock.ts',
      './src/test/matchMedia.mock.ts',
      './src/test/resizeObserver.mock.ts'
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
