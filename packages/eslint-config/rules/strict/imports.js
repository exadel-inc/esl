import importPlugin from 'eslint-plugin-import';

export default [
  {
    plugins: {
      'import': importPlugin
    },
    rules: {
      // Verifies that all named imports are part of the set of named exports in the referenced module.
      'import/named': 'error'
    }
  }
];
