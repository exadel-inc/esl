import tsdoc from 'eslint-plugin-tsdoc';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {tsdoc},
    rules: {
      // Enable TS Doc syntax check
      'tsdoc/syntax': 'warn'
    }
  }
];
