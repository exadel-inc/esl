module.exports = [
  {
    ignores: [
      // Common configuration
      '**/jest.config.js',
      '**/jest*.config.js',
      'eslint.config.js',
      'site/webpack.config.js',
      // Lint configuration
      'linting/eslint.config.*.js',
      // Common directories
      'build/**',
      'node_modules/**',
      // Generated sources
      '/modules/**',
      '/polyfills/**',
      // Submodule output
      '/site/dist/**',
      '/eslint-plugin/dist/**',
      // E2E tests commons
      'e2e/reporters/**',
      'e2e/transformer/**',
    ]
  }
]
