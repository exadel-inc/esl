export default [
  {
    rules: {
      '@typescript-eslint/naming-convention': ['warn', {
        'selector': 'variable',
        'format': ['camelCase', 'PascalCase', 'UPPER_CASE'],
        'leadingUnderscore': 'allow'
      }],
      // Enforces consistent usage of type imports
      '@typescript-eslint/consistent-type-imports': [
        'warn', {
          prefer: 'type-imports'
        }
      ]
    }
  }
];
