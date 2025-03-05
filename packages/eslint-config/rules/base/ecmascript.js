export default [
  {
    rules: {
      // Require return statement in array modification method's callback
      'array-callback-return': 'error',

      // Limit Cyclomatic Complexity
      'complexity': ['warn', {max: 20}],

      // Require usage of === and !==
      'eqeqeq': 'error',

      // Require Guarding for-in to exclude prototype keys
      'guard-for-in': 'warn',

      // There is no blacklisted identifiers
      'id-blacklist': 'off',

      // Max 4 parameters per function
      'max-params': ['warn', 4],

      // Max 3 classes per file (ideally 1 per file)
      'max-classes-per-file': ['warn', 3],

      // Enforce a maximum depth that blocks can be nested to 4
      'max-depth': 'error',

      // Limit max lines count per file to 500
      'max-lines': ['warn', {
        max: 350,
        skipBlankLines: true,
        skipComments: true
      }],

      // Enforce a maximum depth that callbacks can be nested
      'max-nested-callbacks': ['error', {'max': 3}],

      // Warn about native alert usage
      'no-alert': 'warn',

      // Bitwise operators are not recommended
      'no-bitwise': 'warn',

      // Disallow use of caller/callee
      'no-caller': 'error',

      // Console API is formally allowed
      'no-console': 'off',

      // Disallow useless else statements
      'no-else-return': 'error',

      // Disallow null comparisons without type-checking operators
      'no-eq-null': 'error',

      // Warn if unsafe eval used
      'no-eval': 'warn',

      // Disallow extending native types
      'no-extend-native': 'error',

      // Disallow unnecessary calls to .bind()
      'no-extra-bind': 'error',

      // Disallow the use of eval()-like methods
      'no-implied-eval': 'error',

      // Labels are not allowed
      'no-labels': 'error',

      // Disallow unnecessary nested blocks
      'no-lone-blocks': 'error',

      // Disallow function declarations that contain unsafe references inside loop statements
      'no-loop-func': 'error',

      // Disallow new operators with the String, Number, and Boolean objects
      'no-new-wrappers': 'error',

      // Disallow the use of the __proto__ property
      'no-proto': 'error',

      // Warn about comma operators
      'no-sequences': 'warn',

      // Warn about comparisons where both sides are exactly the same
      'no-self-compare': 'warn',

      // Disallow unmodified loop conditions
      'no-unmodified-loop-condition': 'error',

      // Disallow loops with a body that allows only one iteration
      'no-unreachable-loop': 'error',

      // Disallow initializing variables to undefined
      'no-undef-init': 'error',

      // Underscores allowed due to 'private-member' notation
      'no-underscore-dangle': 'off',

      // Disallow unnecessary concatenation of literals or template literals
      'no-useless-concat': 'error',

      // Disallow renaming import, export, and destructured assignments to the same name
      'no-useless-rename': 'error',

      // Deprecate return statement without need
      'no-useless-return': 'warn',

      // 'var' declaration operator is not allowed
      'no-var': 'error',

      // Warn to prefer shorthand object keys
      'object-shorthand': 'warn',

      // Prefer const declaration operator
      'prefer-const': 'warn',

      // No spread preferences in bounds of the library
      'prefer-spread': 'off',

      // Require rest parameters instead of arguments
      'prefer-rest-params': 'warn',

      // Warn about assignments that can lead to race conditions due to usage of await or yield
      'require-atomic-updates': 'warn'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.js', '**/*.spec.js'],
    rules: {
      // Max parameters limit is not applied to tests
      'max-params': 'off',
      // No class count limit for tests
      'max-classes-per-file': 'off',
      // Self compare might be singleton test case
      'no-self-compare': 'off',
      // Jest tests use callback nesting by design
      'max-nested-callbacks': 'off'
    }
  }
];
