import perfectionist from 'eslint-plugin-perfectionist';

export default [
  {
    plugins: {
      perfectionist
    },
    rules: {
      // Enforce a convention in module import order
      'perfectionist/sort-imports': [
        'warn', {
          'groups': [
            'value-builtin',
            'value-external',
            'value-parent',
            'value-sibling',
            'value-index',
            'ts-equals-import',
            'type'
          ],
          type: 'unsorted',
          newlinesBetween: 'ignore',
          newlinesInside: 'ignore'
        }
      ]
    }
  }
];
