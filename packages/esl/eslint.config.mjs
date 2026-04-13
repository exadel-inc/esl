import {lang, strict, esl} from '@exadel/eslint-config-esl';

export default [
  {
    ignores: [
      // Common configuration
      'vitest.config.ts',
      // Generated sources
      'modules/**',
      'polyfills/**'
    ]
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    linterOptions: {
      reportUnusedDisableDirectives: 'warn'
    }
  },

  // Using shared ESL ESLint Config
  ...lang.js,
  ...lang.ts,
  ...strict,
  ...esl.recommended()
];
