import {plugin} from 'typescript-eslint';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': plugin
    },
    rules: {
      // Bans @ts-<directive> comments from being used or requires descriptions after directive
      '@typescript-eslint/ban-ts-comment': 'warn',

      // Enforces consistent usage of type imports
      '@typescript-eslint/consistent-type-imports': [
        'error', {
          prefer: 'type-imports'
        }
      ],

      // Warns if missed return type on functions or class methods
      '@typescript-eslint/explicit-function-return-type': ['warn'],

      // Disallow the use of custom TypeScript modules and namespaces
      '@typescript-eslint/no-namespace': 'error',

      // Flags unnecessary equality comparisons against boolean literals
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',

      // Check that type arguments will not be used if not required
      '@typescript-eslint/no-unnecessary-type-arguments': 'warn',

      // Warns if a type assertion does not change the type of an expression
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn'
    }
  },
  {
    files: ['**/*.shape.ts'],
    rules: {
      '@typescript-eslint/no-namespace': 'off',
      // Temporary of as false positive
      '@typescript-eslint/no-unnecessary-type-arguments': 'off'
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts', '**/*.test-d.ts', '**/*.spec-d.ts'],
    rules: {
      // Allow the use of TS directives in test declaration files
      '@typescript-eslint/ban-ts-comment': 'off',
      // Allow unused variables in test declaration files
      '@typescript-eslint/no-unused-vars': 'off',
      // Allow unused expressions in test declaration files
      '@typescript-eslint/no-unused-expressions': 'off',
      // Allow missed return type on functions or class methods in test files
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
];
