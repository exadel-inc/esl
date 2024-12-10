/** Default TS Configuration */
module.exports.typescript = require('./rules/eslint.config.language');

/** Shared plugins */
module.exports.plugins = {
  get '@stylistic' () {
    return require('@stylistic/eslint-plugin')
  },
  get 'editorconfig'() {
    return require('eslint-plugin-editorconfig');
  },
  get 'import'() {
    return require('eslint-plugin-import-x');
  },
  get 'tsdoc'() {
    return require('eslint-plugin-tsdoc');
  },
  get 'sonarjs'() {
    return require('eslint-plugin-sonarjs');
  },
  get 'typescript-eslint' () {
    return require('typescript-eslint')
  }
};

/** Default ESLint Configuration */
module.exports.recommended = [
  ...require('./rules/eslint.config.codestyle'),
  ...require('./rules/eslint.config.coderules'),
  ...require('./rules/eslint.config.sonarjs'),
  ...require('./rules/eslint.config.stylistic'),
  ...require('./rules/eslint.config.editorconfig'),
  ...require('./rules/eslint.config.import'),
  ...require('./rules/eslint.config.tsdoc')
];

// TODO: Separate ES / TS builder
