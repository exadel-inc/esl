export default [
  {
    ignores: [
      // Typings
      '**/*.d.ts',
      // Common configuration
      '**/jest.config.js',
      '**/jest*.config.js',
      'eslint.config.js',
      'eslint.config.*.js',
      // Common directories
      'build/**',
      'node_modules/**',
      '**/dist/**',
      // Generated sources
      'modules/**',
      'polyfills/**'
    ]
  }
];
