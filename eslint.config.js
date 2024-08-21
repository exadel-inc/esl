const tseslint = require('typescript-eslint');

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [
      //Common configuration
      "jest.config.js",
      //Common directories
      "build/**",
      "node_modules/**",
      //Generated sources
      "/modules/**",
      "/polyfills/**",
      //Submodule output
      "/site/dist/**",
      "/eslint/dist/**"
    ],
    languageOptions: {
      ecmaVersion: 2017,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: "warn"
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin
    },
  },
];
