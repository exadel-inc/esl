module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    }
  },
  ...require('./linting/eslint.config.ignore'),
  ...require('./linting/eslint.config.language'),
  ...require('./linting/eslint.config.codestyle'),
  ...require('./linting/eslint.config.coderules'),
  ...require('./linting/eslint.config.sonarjs'),
  ...require('./linting/eslint.config.stylistic'),
  ...require('./linting/eslint.config.editorconfig'),
  ...require('./linting/eslint.config.import'),
  ...require('./linting/eslint.config.tsdoc'),

  // ESL ESLint Plugin
  ...require('@exadel/eslint-plugin-esl').configs.recommended
];
