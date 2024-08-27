const {readYAML} = require('./eslint.config.utils');
const importPlugin = require('eslint-plugin-import-x');

module.exports = [
  {
    plugins: {
      importPlugin
    },
    files: ["eslint/src/**/*.ts"],
    ...readYAML('eslint.config.import.rules')
  },
  {
    files: ["./site/**/*.ts"],
    rules: {
      'no-restricted-imports': ["error", {
        "patterns": [{
          "group": ["../../**/modules/**", "../../**/polyfills/**"],
          'message': "Do not import from src/modules directly. Use the `@exadel/esl` package resolved by NPM workspaces instead."
        }]
      }]
    }
  }
]
