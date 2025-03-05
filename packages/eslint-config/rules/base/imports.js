import importPlugin from 'eslint-plugin-import-x';

export default [
  {
    plugins: {
      'import': importPlugin
    },
    rules: {
      // Reports funny business with exports, like repeated exports of names or defaults.
      'import/export': 'warn',

      // Warn about duplicate imports
      'no-duplicate-imports': 'off',
      'import/no-duplicates': 'warn',

      // Forbid a module from importing itself
      'import/no-self-import': 'error',

      // Deprecate cyclic dependencies
      'import/no-cycle': 'error'
    }
  }
];
