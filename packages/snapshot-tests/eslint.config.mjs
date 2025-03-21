import {lang, strict} from '@exadel/eslint-config-esl';

export default [
  {
    ignores: [
      // Typings
      '**/*.d.ts',
      // Common configuration
      '**/jest.config.js',
      '**/jest*.config.js',
      'eslint.config.js',
      // Common directories
      '.diff',
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
  ...strict
];
