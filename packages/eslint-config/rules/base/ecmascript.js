export default [
  {
    rules: {
      // Require Guarding for-in to exclude prototype keys
      'guard-for-in': 'warn',

      // There is no blacklisted identifiers
      'id-blacklist': 'off',

      // Bitwise operators are not recommended
      'no-bitwise': 'warn',

      // Console API is formally allowed
      'no-console': 'off',

      // Labels are not allowed
      'no-labels': 'error',

      // Limit Cyclomatic Complexity
      'complexity': ['warn', {max: 20}],

      // Max 3 classes per file (ideally 1 per file)
      'max-classes-per-file': ['warn', 3],

      // Deprecate return statement without need
      'no-useless-return': 'warn',

      // Underscores allowed due to 'private-member' notation
      'no-underscore-dangle': 'off',

      // 'var' declaration operator is not allowed
      'no-var': 'error',

      // Warn to prefer shorthand object keys
      'object-shorthand': 'warn',

      // Prefer const declaration operator
      'prefer-const': 'warn',

      // No spread preferences in bounds of the library
      'prefer-spread': 'off',

      // Limit max lines count per file to 500
      'max-lines': ['warn', 500]
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      // no class count limit for tests
      'max-classes-per-file': 'off'
    }
  }
];
