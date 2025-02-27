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
      // ESL ESLint Plugin output
      '/eslint-plugin/dist/**',
      // ESL ESLint Config files
      '/eslint-config/**',
      // E2E tests commons
      'e2e/reporters/**',
      'e2e/transformer/**',
    ]
  }
];
