import tsdoc from 'eslint-plugin-tsdoc';
export default [
  {
    plugins: { tsdoc },
    rules: {
      // Enable TS Doc syntax check
      'tsdoc/syntax': "warn"
    }
  }
];
