import {lang, strict, esl} from '@exadel/eslint-config-esl';

export default [
  {
    ignores: [
      // Common directories
      'node_modules/**',
      // Submodule output
      'dist/**'
    ]
  },

  // Using shared ESL ESLint Config
  ...lang.ts,
  ...strict,
  ...esl.recommended
];
