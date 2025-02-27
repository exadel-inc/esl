import stylistic from '@stylistic/eslint-plugin';

export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/arrow-parens': ['warn', 'always'],

      // Prefer consistent brace style for blocks
      '@stylistic/brace-style': 'warn',

      // Prefer consistent spacing before and after commas
      '@stylistic/comma-spacing': 'warn',

      // Allows trailing comma
      '@stylistic/comma-dangle': 'off',

      // Require spacing between function identifiers and their invocations
      '@stylistic/function-call-spacing': ['warn', 'never'],

      // Warn for consistent indentations
      '@stylistic/indent': [
        'warn',
        2, {
          ignoredNodes: ['FunctionExpression', 'FunctionDeclaration'],
          SwitchCase: 1,
          ObjectExpression: 1,
          ImportDeclaration: 1,
          flatTernaryExpressions: false
        }
      ],

      // Require consistent spacing before and after keywords
      '@stylistic/keyword-spacing': [
        'warn', {
          after: true,
          before: true
        }
      ],

      // Allows an empty line between class members
      '@stylistic/lines-between-class-members': 'off',

      // Warn about a maximum line length to be 160
      '@stylistic/max-len': [
        'warn', {
          code: 160
        }
      ],

      // Require a semicolon member delimiter style for interfaces and type literals
      '@stylistic/member-delimiter-style': [
        'warn', {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false
          }
        }
      ],

      // Require parentheses when invoking a constructor with no arguments
      '@stylistic/new-parens': 'error',

      // Allow unnecessary parentheses
      '@stylistic/no-extra-parens': 'off',

      // Warn about unnecessary semicolons
      '@stylistic/no-extra-semi': 'warn',

      // Disallow mixed spaces and tabs for indentation
      '@stylistic/no-mixed-spaces-and-tabs': 'error',

      // Warn about multiple empty lines
      '@stylistic/no-multiple-empty-lines': [
        'warn', {
          max: 2,
          maxEOF: 1,
          maxBOF: 1
        }
      ],

      // Warn about trailing whitespace at the end of lines
      '@stylistic/no-trailing-spaces': 'warn',

      // Prefer consistent spacing inside braces
      '@stylistic/object-curly-spacing': ['warn', 'never'],

      // Enforce the consistent use of single quotes
      '@stylistic/quotes': ['error', 'single'],

      // Require semicolons instead of ASI
      '@stylistic/semi': 'error',

      // Enforce location of semicolons
      '@stylistic/semi-style': ['error', 'last'],

      // Warn about missing space before blocks
      '@stylistic/space-before-blocks': ['warn', 'always'],

      // Prefer consistent spacing before function parenthesis
      '@stylistic/space-before-function-paren': [
        'warn', {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],

      // Warn about spaces inside of parentheses
      '@stylistic/space-in-parens': ['warn', 'never'],

      // This rule is aimed at ensuring there are spaces around infix operators.
      '@stylistic/space-infix-ops': 'warn',

      // Requires a whitespace at the beginning of a comment
      '@stylistic/spaced-comment': 'warn',

      // Require consistent spacing around type annotations
      '@stylistic/type-annotation-spacing': 'warn',
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // It's ok to write braces single line in tests
      '@stylistic/brace-style': "off",
    }
  },
]
