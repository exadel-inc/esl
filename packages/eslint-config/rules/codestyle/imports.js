import importPlugin from 'eslint-plugin-import';

export default [
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
      ]

    }
  }
];
