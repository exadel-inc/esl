const tseslint = require('typescript-eslint');
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true
      }
    }
  }
]
