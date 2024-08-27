const importPlugin = require('eslint-plugin-import-x');

module.exports = [
  {
    plugins: {
      importPlugin
    },
    ...require('js-yaml').load('./import/eslintrc.yml'),
    files: ["eslint/src/**/*.ts"],
    rules: {
      'importPlugin/no-default-export': "off"
    }
  }
]
