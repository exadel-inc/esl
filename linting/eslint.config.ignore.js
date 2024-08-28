module.exports = [
  {
    ignores: [
      //Common configuration
      "jest.config.js",
      "eslint.config.js",
      // Lint configuration
      "linting/eslint.config.*.js",
      //Common directories
      "build/**",
      "node_modules/**",
      //Generated sources
      "/modules/**",
      "/polyfills/**",
      //Submodule output
      "/site/dist/**",
      "/eslint/dist/**"
    ]
  }
]
