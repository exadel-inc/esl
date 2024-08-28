const {readYAML} = require('./eslint.config.utils');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: readYAML('eslint.config.stylistic.rules')
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // it's ok to write braces single line in tests
      '@stylistic/brace-style': "off",
    }
  },
]
