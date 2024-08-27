const sonarjs = require('eslint-plugin-sonarjs');const fs = require('fs');
const path = require('path');

const sonarjsRules = fs.readFileSync(path.resolve(__dirname, `./sonarjs.eslintrc.yml`), 'utf8');

module.exports = [
  {
    plugins: {
      sonarjs
    },
    ...require('js-yaml').load(sonarjsRules, {})
  }
]
