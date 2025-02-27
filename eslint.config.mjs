import { lang, strict } from '@exadel/eslint-config-esl';
import { recommended as eslRecommended } from '@exadel/eslint-plugin-esl';
import eslintConfigIgnore from './eslint.config.ignore.mjs';

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    }
  },
  ...eslintConfigIgnore,

  // Using shared ESL ESLint Config
  ...lang,
  ...strict,

  // ESL ESLint Plugin
  ...eslRecommended,

  // Overrides
  {
    files: ["**/polyfills/**/*.ts"],
    rules: {
      'no-new-wrappers': "off"
    }
  },
  {
    files: ["site/**/*.ts"],
    rules: {
      'no-restricted-imports': ["error", {
        "patterns": [{
          "group": ["../../**/modules/**", "../../**/polyfills/**"],
          'message': "Do not import from src/modules directly. Use the `@exadel/esl` package resolved by NPM workspaces instead."
        }]
      }]
    }
  }
];
