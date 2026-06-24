import {lang, strict} from '@exadel/eslint-config-esl';

export default [
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
