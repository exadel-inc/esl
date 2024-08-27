const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const stylistic = require('@stylistic/eslint-plugin');

const tsdoc = require('eslint-plugin-tsdoc');
const editorconfig = require('eslint-plugin-editorconfig');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...require('./linting/eslint.config.ignore'),
  ...require('./linting/eslint.config.language'),
  {
    files: ["**/*.ts", "**/*.tsx"],
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic': stylistic,
      tsdoc,
      editorconfig,
    },
    rules: {
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
  ...require('./linting/eslint.config.coderules'),
  ...require('./linting/eslint.config.codestyle'),
  ...require('./linting/eslint.config.sonarjs'),
  ...require('./linting/eslint.config.deprecated'),
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
  ...require('./linting/eslint.config.import'),
  {
    // Allow the use of custom TypeScript modules and namespaces for JSX shapes
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // no class count limit for tests
      'max-classes-per-file': "off",
      // it's ok to write braces single line in tests
      '@stylistic/brace-style': "off",
      // ts-ignore is off to test clean es cases
      '@typescript-eslint/ban-ts-comment': "off",
      // there is no need to evaluate tests strictly
      '@typescript-eslint/non-nullable-type-assertion-style': "off",
      // return type on functions or class methods is not required in tests
      '@typescript-eslint/explicit-function-return-type': "off"
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
];
