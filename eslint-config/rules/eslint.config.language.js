module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: "module",
      parser: require('typescript-eslint').parser,
      parserOptions: {
        projectService: true
      }
    }
  }
]
