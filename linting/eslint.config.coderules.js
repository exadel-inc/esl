const fs = require('fs');
const path = require('path');

const codeRules = fs.readFileSync(path.resolve(__dirname, `./coderules.eslintrc.yml`), 'utf8');

module.exports = [
  {
    ...require('js-yaml').load(codeRules, {})
  }
]
