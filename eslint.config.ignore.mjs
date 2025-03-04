export default [
  {
    ignores: [
      // Common configuration
      '**/jest.config.js',
      '**/jest*.config.js',
      'eslint.config.js',
      'eslint.config.*.js',
      'site/webpack.config.js',
      // Common directories
      'build/**',
      'node_modules/**',
      // Generated sources
      '/modules/**',
      '/polyfills/**',
      // Site output
      '/site/dist/**',
      // ESL ESLint Plugin files
      '/packages/eslint-plugin/**',
      // ESL ESLint Config files
      '/packages/eslint-config/**',
      // E2E tests commons
      'e2e/reporters/**',
      'e2e/transformer/**',
    ]
  }
];
