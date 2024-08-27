const yaml = require('js-yaml');
const path = require('path')
const fs = require('fs');

const LINT_PATHS = ['deprecated', 'codestyle', 'coderules', 'import', 'sonarjs'];

const LINT_RULES = LINT_PATHS.reduce((acc,name) => {
  const content = fs.readFileSync(path.resolve(__dirname, `./linting/${name}.eslintrc.yml`), 'utf8');
  return Object.assign(acc, yaml.load(content, {}).rules);
}, {});

module.exports.LINT_RULES = LINT_RULES;
