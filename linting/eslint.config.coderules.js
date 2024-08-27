const fs = require('fs');
const path = require('path');

const codeRules = fs.readFileSync(path.resolve(__dirname, `./coderules.eslintrc.yml`), 'utf8');

module.exports = [
  {
    rules: require('js-yaml').load(codeRules, {}).rules
  },
  {
    files: ["**/*.shape.ts"],
    rules: {
      '@typescript-eslint/no-namespace': "off",
      // Temporary of as false positive
      '@typescript-eslint/no-unnecessary-type-arguments': "off"
    }
  },
  {
    files: ["**/polyfills/**/*.ts"],
    rules: {
      'no-new-wrappers': "off"
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // ts-ignore is off to test clean es cases
      '@typescript-eslint/ban-ts-comment': "off",
      // there is no need to evaluate tests strictly
      '@typescript-eslint/non-nullable-type-assertion-style': "off",
      // return type on functions or class methods is not required in tests
      '@typescript-eslint/explicit-function-return-type': "off"
    }
  }
]
