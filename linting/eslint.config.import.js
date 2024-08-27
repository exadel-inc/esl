const importPlugin = require('eslint-plugin-import-x');
const fs = require('fs');
const path = require('path');

const importRules = fs.readFileSync(path.resolve(__dirname, `./import.eslintrc.yml`), 'utf8');

module.exports = [
  {
    plugins: {
      importPlugin
    },
    ...require('js-yaml').load(importRules, {}),
    files: ["eslint/src/**/*.ts"],
    rules: {
      'importPlugin/no-default-export': "off"
    }
  }
]
