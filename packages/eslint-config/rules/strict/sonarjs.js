import sonarjs from 'eslint-plugin-sonarjs';

export default [
  {
    plugins: {sonarjs},
    rules: {
      /** Cognitive Complexity is a measure of how hard the control flow of a function is to understand.
       *  Functions with high Cognitive Complexity will be difficult to maintain.
       */
      'sonarjs/cognitive-complexity': 'error',

      // Limits maximum of switch cases before suggest a map
      'sonarjs/max-switch-cases': ['error', 6],

      // Merging collapsible if statements increases the code's readability.
      'sonarjs/no-collapsible-if': 'error',

      // Having all branches in a switch or if chain with the same implementation is an error.
      'sonarjs/no-duplicated-branches': 'error',

      /** If a boolean expression doesn’t change the evaluation of the condition,
       *  then it is entirely unnecessary, and can be removed.
       */
      'sonarjs/no-gratuitous-expressions': 'warn',

      // Disallows identical functions
      'sonarjs/no-identical-functions': 'warn',

      // Disallows nested switch structures as they are difficult to understand
      'sonarjs/no-nested-switch': 'error',

      // Redundant Boolean literals should be removed from expressions to improve readability.
      'sonarjs/no-redundant-boolean': 'error',

      // Code is clearest when each statement has its own line.
      'sonarjs/no-same-line-conditional': 'error',

      // For just one or two cases however, the code will be more readable with if statements.
      'sonarjs/no-small-switch': 'warn',

      // This rule raises an issue when no methods are called on a collection other than those that add or remove values.
      'sonarjs/no-unused-collection': 'error',

      /**
       * When only the condition expression is defined in a for loop, and the initialization and
       * increment expressions are missing, a while loop should be used instead to increase readability.
       */
      'sonarjs/prefer-while': 'error',

      // Prefer creating a literal instead of fill the object "key by key"
      'sonarjs/prefer-object-literal': 'warn',

      // Declaring a variable only to immediately return or throw it is a bad practice.
      'sonarjs/prefer-immediate-return': 'warn'
    }
  }
];
