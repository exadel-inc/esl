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
    rules: {
      // Enforces naming conventions for everything across a codebase
      // TODO: configure
      // '@typescript-eslint/naming-convention': [
      //    warn, {
      //      selector: variable,
      //      format: [ camelCase, PascalCase, UPPER_CASE ],
      //      leadingUnderscore: allow
      //    }
      //  ]

      // Limit Cyclomatic Complexity
      'complexity': 'warn',

      // Require following curly brace conventions
      'curly': ['warn', 'multi-line'],

      // Max 3 classes per file (ideally 1 per file)
      'max-classes-per-file': ['warn', 3],

      // Warn about empty block statements
      'no-empty': 'warn',

      // Underscores allowed due to 'private-member' notation
      'no-underscore-dangle': 'off',

      // 'var' declaration operator is not allowed
      'no-var': 'error',

      // Warn to prefer shorthand object keys
      'object-shorthand': 'warn',

      // Disallow multiple declaration per one line or declaration operator
      'one-var': ['error', 'never'],

      // Using of arrow functions is optional
      'prefer-arrow-callback': 'off',

      // Prefer const declaration operator
      'prefer-const': 'error',

      // Limit max lines count per file to 500
      'max-lines': ['warn', 500],

      // Do not enforce dot notation whenever possible
      'dot-notation': 'off',
      '@typescript-eslint/dot-notation': 'off',

      // Prefers consistent usage of type assertions
      '@typescript-eslint/consistent-type-assertions': 'warn',

      // Require the use of the namespace keyword instead of the module keyword to declare custom TypeScript modules
      '@typescript-eslint/prefer-namespace-keyword': 'warn',

      // Allows initialization in variable declarations
      'init-declarations': 'off',
      '@typescript-eslint/init-declarations': 'off',

      // Warn about duplicate class members
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'warn',

      // The use of eval()-like methods is not recommended
      'no-eval': 'off',
      'no-implied-eval': 'off',
      '@typescript-eslint/no-implied-eval': 'warn',

      // Allows this keywords outside of classes or class-like objects
      'no-invalid-this': 'off',
      '@typescript-eslint/no-invalid-this': 'off',

      // Warn about function declarations that contain unsafe references inside loop statements
      'no-loop-func': 'off',
      '@typescript-eslint/no-loop-func': 'warn',

      // Warn about literal numbers that lose precision
      'no-loss-of-precision': 'off',
      '@typescript-eslint/no-loss-of-precision': 'warn',

      // Disallow variable redeclaration
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',

      // Warn about variable declarations that are shadowing variables declared in the outer scope
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'warn',

      // Warn about throwing literals as exceptions
      'only-throw-error': 'off',
      '@typescript-eslint/only-throw-error': 'warn',

      // Allows unused expressions
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // Warn about unused variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all', caughtErrors: 'none', args: 'none'
        }
      ],

      // Warn about unnecessary constructors
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',

      // Do not warn if an async function has no await expression
      'require-await': 'off',
      '@typescript-eslint/require-await': 'off',

      // Prefers consistent returning of awaited values
      'return-await': 'off',
      '@typescript-eslint/return-await': 'warn',

      // No spread preferences in bounds of the library
      'prefer-spread': 'off'
    }
  },
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      // no class count limit for tests
      'max-classes-per-file': "off"
    }
  }
]
