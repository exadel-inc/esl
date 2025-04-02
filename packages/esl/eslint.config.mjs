import {lang, strict} from '@exadel/eslint-config-esl';
import {recommended as eslRecommended} from '@exadel/eslint-plugin-esl';

export default [
  {
    ignores: [
      // Common configuration
      'jest.config.js',
      'eslint.config.js',
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
  ...lang.ts,
  ...strict,

  // ESL ESLint Plugin
  ...eslRecommended
];
