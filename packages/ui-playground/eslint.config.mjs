import {lang, strict} from '@exadel/eslint-config-esl';
import {recommended as eslRecommended} from '@exadel/eslint-plugin-esl';

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

  // ESL ESLint Plugin
  ...eslRecommended
];
