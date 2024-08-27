const stylistic = require('@stylistic/eslint-plugin');
const fs = require('fs');
const path = require('path');

const deprecatedRules = fs.readFileSync(path.resolve(__dirname, `./deprecated.eslintrc.yml`), 'utf8');

module.exports = [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: require('js-yaml').load(deprecatedRules, {}).rules
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // it's ok to write braces single line in tests
      '@stylistic/brace-style': "off",
    }
  },
]
