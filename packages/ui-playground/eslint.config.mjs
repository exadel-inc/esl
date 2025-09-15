import {lang, strict} from '@exadel/eslint-config-esl';

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
  ...await (async () => {
    try {
      return (await import('@exadel/eslint-plugin-esl')).recommended;
    } catch {
      return [];
    }
  })(),
];
