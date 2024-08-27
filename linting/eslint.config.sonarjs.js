const {readYAML} = require('./eslint.config.utils');
const sonarjs = require('eslint-plugin-sonarjs');

module.exports = [
  {
    plugins: {
      sonarjs
    },
    rules: readYAML('eslint.config.sonarjs.rules')
  }
]
