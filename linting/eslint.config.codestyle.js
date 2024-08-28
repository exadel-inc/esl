const {readYAML} = require('./eslint.config.utils');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      eslint,
      '@typescript-eslint': tseslint.plugin,
    },
    rules: readYAML('eslint.config.codestyle.rules')
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // no class count limit for tests
      'max-classes-per-file': "off"
    }
  }
]
