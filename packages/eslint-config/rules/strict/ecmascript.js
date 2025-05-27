export default [
  {
    rules: {
      // Limit Cyclomatic Complexity
      'complexity': ['warn', {max: 16}],

      // Require Guarding for-in to exclude prototype keys
      'guard-for-in': 'error',

      // Require function to be compact
      'max-lines-per-function': ['error', {max: 55}],

      // Disallow redundant boolean cast
      'no-extra-boolean-cast': 'warn',

      // Deprecate a catch without payload
      'no-useless-catch': 'error',

      // Deprecate return statement without need
      'no-useless-return': 'error',

      // Disallow multiple declaration per one line or declaration operator
      'one-var': ['error', 'never'],

      // Prefer const declaration operator
      'prefer-const': 'error',

      // Require implicit radix parameter for parseInt
      'radix': 'error'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.test.js', '**/*.spec.ts', '**/*.spec.js'],
    rules: {
      // A loyal limit for cyclomatic complexity
      'complexity': ['warn', {max: 25}],

      // No limitation in tests
      'max-lines-per-function': 'off',
    }
  }
];
