module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    }
  },
  ...require('./eslint.config.ignore'),

  // Using shared ESL ESLint Config
  ...require('@exadel/eslint-config-esl').typescript,
  ...require('@exadel/eslint-config-esl').recommended,

  // ESL ESLint Plugin
  ...require('@exadel/eslint-plugin-esl').recommended,

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
