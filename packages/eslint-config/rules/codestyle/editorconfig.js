import stylistic from '@stylistic/eslint-plugin';

// Use ESLint rules according to EditorConfig settings
export default [
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      'unicode-bom': ['warn', 'never'],
      '@stylistic/eol-last': 'warn',
      '@stylistic/no-trailing-spaces': 'warn'
    }
  }
];
