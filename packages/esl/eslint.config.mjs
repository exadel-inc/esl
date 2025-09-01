import {lang, strict} from '@exadel/eslint-config-esl';

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
  ...lang.js,
  ...lang.ts,
  ...strict,

  // ESL ESLint Plugin
  ...await (async () => {
    try {
      return (await import('@exadel/eslint-plugin-esl')).recommended;
    } catch {
      return [];
    }
  })(),
];
