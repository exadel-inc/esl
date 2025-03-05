export default [
  {
    rules: {
      '@typescript-eslint/naming-convention': ['warn', {
        'selector': 'variable',
        'format': ['camelCase', 'PascalCase', 'UPPER_CASE'],
        'leadingUnderscore': 'allow'
      }]
    }
  }
];
