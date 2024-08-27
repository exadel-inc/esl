const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const tsdoc = require('eslint-plugin-tsdoc');
const editorconfig = require('eslint-plugin-editorconfig');
const fs = require('fs');
const path = require('path');

const codestyleRules = fs.readFileSync(path.resolve(__dirname, `./codestyle.eslintrc.yml`), 'utf8');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      eslint,
      '@typescript-eslint': tseslint.plugin,
      tsdoc,
      editorconfig
    },
    rules: {
      ...require("js-yaml").load(codestyleRules, {}).rules,
      // Enable TS Doc syntax check
      'tsdoc/syntax': "warn",
      // Enforce charset check
      'editorconfig/charset': "warn",
      // Enforce EOL for all files
      'editorconfig/eol-last': "warn",
      // Require no trailing spaces
      'editorconfig/no-trailing-spaces': "warn"
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // no class count limit for tests
      'max-classes-per-file': "off"
    }
  },
  {
    // Allow the use of custom TypeScript modules and namespaces for JSX shapes
    files: ["./site/**/*.ts"],
    rules: {
      'no-restricted-imports': ["error", {
        "patterns": [{
          "group": ["../../**/modules/**", "../../**/polyfills/**"],
          'message': "Do not import from src/modules directly. Use the `@exadel/esl` package resolved by NPM workspaces instead."
        }]
      }]
    }
  }
]
