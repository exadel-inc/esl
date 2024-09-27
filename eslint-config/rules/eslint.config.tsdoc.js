const tsdoc = require('eslint-plugin-tsdoc');

module.exports = [
  {
    plugins: {
      tsdoc
    },
    rules: {
      // Enable TS Doc syntax check
      'tsdoc/syntax': "warn"
    }
  }
];
