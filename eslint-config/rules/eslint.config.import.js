const importPlugin = require('eslint-plugin-import-x');

module.exports = [
  {
    plugins: {
      'import': importPlugin
    },
    rules: {
      // Enforce a convention in module import order
      'import/order': [
        'warn', {
          'groups': ['builtin', 'external', 'parent', 'sibling', 'index', 'object', 'type']
        }
      ],

      // Reports funny business with exports, like repeated exports of names or defaults.
      'import/export': 'warn',

      // Warn about duplicate imports
      'no-duplicate-imports': 'off',
      'import/no-duplicates': 'warn',

      // Verifies that all named imports are part of the set of named exports in the referenced module.
      'import/named': 'error',

      // Prohibit default exports
      'import/no-default-export': 'warn',

      // Forbid a module from importing itself
      'import/no-self-import': 'error',

      // Deprecate cyclic dependencies
      'import/no-cycle': 'error'
    }
  }
]
