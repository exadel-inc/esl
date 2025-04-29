import {lang, strict} from '@exadel/eslint-config-esl';
import {recommended as eslRecommended} from '@exadel/eslint-plugin-esl';

export default [
  {
    ignores: [
      // Common configuration
      'site/webpack.config.js',
      // Common directories
      'node_modules/**',
      // Submodule output
      'esm/**',
      'bundles/**',
      'site/dist/**',
    ]
  },

  // Using shared ESL ESLint Config
  ...lang.ts,
  ...strict,

  // ESL ESLint Plugin
  ...eslRecommended
];
