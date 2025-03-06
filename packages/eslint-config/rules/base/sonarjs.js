import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    plugins: {sonarjs},
    rules: {
      // Arguments to built-in functions should match documented types
      'sonarjs/argument-type': 'error',

      /**
       * Cognitive Complexity is a measure of how hard the control flow of a function is to understand.
       * Functions with high Cognitive Complexity will be difficult to maintain.
       */
      'sonarjs/cognitive-complexity': 'warn',

      // Comma and logical OR operators should not be used in switch cases
      'sonarjs/comma-or-logical-or-case': 'error',

      // Regular expression quantifiers and character classes should be used concisely
      'sonarjs/concise-regex': 'warn',

      // Repeated patterns in regular expressions should not match the empty string
      'sonarjs/empty-string-repetition': 'error',

      // Operator "in" should not be used with primitive types
      'sonarjs/in-operator-type-error': 'error',

      // Operator "delete" should not be used on arrays
      'sonarjs/no-array-delete': 'error',

      // Merging collapsible if statements increases the code's readability.
      'sonarjs/no-collapsible-if': 'warn',

      // Operator "delete" should be used only with object properties
      'sonarjs/no-delete-var': 'error',

      // Alternation in regular expressions should not contain empty alternatives
      'sonarjs/no-empty-alternatives': 'warn',

      // Empty character classes in RegExp should not be used
      'sonarjs/no-empty-character-class': 'error',

      // The global "this" object should not be used
      'sonarjs/no-global-this': 'error',

      // Do not nest the same boolean conditions
      'sonarjs/no-gratuitous-expressions': 'warn',

      // Functions should not have identical implementations
      'sonarjs/no-identical-functions': 'warn',

      // Operator "in" should not be used on arrays
      'sonarjs/no-in-misuse': 'error',

      // This rule raises an issue when no methods are called on a collection other than those that add or remove values.
      'sonarjs/no-unused-collection': 'warn',

      /**
       * When only the condition expression is defined in a for loop, and the initialization and
       * increment expressions are missing, a while loop should be used instead to increase readability.
       */
      'sonarjs/prefer-while': 'warn',

      // Prefer shorthand promises expressions for simple cases of promise fulfillment
      'sonarjs/prefer-promise-shorthand': 'warn',

      // "RegExp.exec()" should be preferred over "String.match()"
      'sonarjs/prefer-regexp-exec': 'warn'
    }
  },
  {
    files: ['*.jsx', '*.tsx'],
    plugins: {sonarjs},
    rules: {
      // JSX components should not render non-boolean condition values
      'sonarjs/jsx-no-leaked-render': 'error',

      // JSX props should be read-only
      'sonarjs/prefer-read-only-props': 'warn'
    }
  }
];
