import {lang, strict} from '@exadel/eslint-config-esl';

export default [
  {
    ignores: [
      // Generated artifacts
      'playwright-report/**',
      'test-results/**',

      // Snapshots
      'tests/**/*-snapshots/**',

      // Common directories
      'node_modules/**'
    ]
  },
  {
    files: ['**/*.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: 'warn'
    }
  },

  // Using shared ESL ESLint Config
  ...lang.js,
  ...lang.ts,
  ...strict,

  // Custom overrides
  {
    files: ['**/*.js', '**/*.ts'],
    rules: {
      'preserve-caught-error': 'off'
    }
  }
];
