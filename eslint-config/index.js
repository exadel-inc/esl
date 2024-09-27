module.exports.eslrules = [
  ...require('./rules/eslint.config.language'),
  ...require('./rules/eslint.config.codestyle'),
  ...require('./rules/eslint.config.coderules'),
  ...require('./rules/eslint.config.sonarjs'),
  ...require('./rules/eslint.config.stylistic'),
  ...require('./rules/eslint.config.editorconfig'),
  ...require('./rules/eslint.config.import'),
  ...require('./rules/eslint.config.tsdoc'),
];

module.exports.default = module.exports.eslrules;
