import {lang, strict} from './index.js';

export default [
  {
    ignores: [
      // Typings
      '**/*.d.ts',
      // Common configuration
      'jest.config.js'
    ]
  },
  {
    files: ['**/*.js'],
    linterOptions: {
      reportUnusedDisableDirectives: 'warn'
    }
  },

  // Using shared ESL ESLint Config
  ...lang.js,
  ...strict
];
