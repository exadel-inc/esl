const fs = require('fs');
const path = require('path');

const deprecatedRules = fs.readFileSync(path.resolve(__dirname, `./deprecated.eslintrc.yml`), 'utf8');

module.exports = [
  {
    ...require('js-yaml').load(deprecatedRules, {}),
  }
]
