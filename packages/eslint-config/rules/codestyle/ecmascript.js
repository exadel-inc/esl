export default [
  {
    rules: {
      // Enforce camelcase naming convention
      'camelcase': ['warn', {
        properties: 'never'
      }],

      // Require following curly brace conventions
      'curly': ['warn', 'multi-line'],
    }
  }
];
