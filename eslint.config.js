module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    }
  },

  ...require('./eslint.config.ignore'),
  ...require('@exadel/eslint-config-esl').typescript,
  ...require('@exadel/eslint-config-esl').recommended
];
