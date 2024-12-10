module.exports = [
  {
    plugins: {
      tsdoc: require('eslint-plugin-tsdoc')
    },
    rules: {
      // Enable TS Doc syntax check
      'tsdoc/syntax': "warn"
    }
  }
];
