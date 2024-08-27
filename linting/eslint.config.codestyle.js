const fs = require('fs');
const path = require('path');

const codestyleRules = fs.readFileSync(path.resolve(__dirname, `./codestyle.eslintrc.yml`), 'utf8');

module.exports = [
  {
    ...require('js-yaml').load(codestyleRules, {})
  }
]
