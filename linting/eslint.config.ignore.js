module.exports = [
  {
    ignores: [
      // Common configuration
      'eslint.config.js',
      'site/webpack.config.js',
      // Lint configuration
      'linting/eslint.config.*.js',
      // Common directories
      'node_modules/**',
      // Submodule output
      'esm/**',
      'bundles/**',
      'site/dist/**',
    ]
  }
]
