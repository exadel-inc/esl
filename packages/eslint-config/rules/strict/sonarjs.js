import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    plugins: {sonarjs},
    rules: {
      // Parameters should be passed in the correct order
      'sonarjs/arguments-order': 'warn',

      // Objects should not be created to be dropped immediately without being used
      'sonarjs/constructor-for-side-effects': 'error',

      /**
       * Cognitive Complexity is a measure of how hard the control flow of a function is to understand.
       * Functions with high Cognitive Complexity will be difficult to maintain.
       */
      'sonarjs/cognitive-complexity': 'error',

      // Functions should not be defined inside loops
      'sonarjs/function-inside-loop': 'warn',

      // Merging collapsible if statements increases the code's readability.
      'sonarjs/no-collapsible-if': 'error',

      // Disallows nested switch structures as they are difficult to understand
      'sonarjs/no-nested-switch': 'error',

      // Code is clearest when each statement has its own line.
      'sonarjs/no-same-line-conditional': 'error',

      // For just one or two cases however, the code will be more readable with if statements.
      'sonarjs/no-small-switch': 'warn',

      // This rule raises an issue when no methods are called on a collection other than those that add or remove values.
      'sonarjs/no-unused-collection': 'error',

      // Declaring a variable only to immediately return or throw it is a bad practice.
      'sonarjs/prefer-immediate-return': 'warn'
    }
  },
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'],
    rules: {
      // There are could be some cases where the constructor is used for side effects in unit tests
      'sonarjs/constructor-for-side-effects': 'off',
    }
  }
];
