// TODO: rewrite for base rule
'use strict';

const rule = require('../rules/4.0.0/deprecated.traversing-query');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('rules/deprecated/traversing-query', rule, {
  valid: [
    {code: 'import {ESLTraversingQuery} from \'../../esl-traversing-query/core\';'},
    {code: 'import {ESLTraversingQuery as FN}  from \'../../esl-traversing-query/core/esl-traversing-query\';\n'},
    {
      code: 'if (ESLTraversingQuery.one() && FN.one(\'data\')) {\n' +
        '  const TraversingQuery = \'data\';\n' +
        '}\n'
    },
    {
      code: 'import {ESLTraversingQuery} from \'../../../src/modules/esl-traversing-query/core\';\n' +
        'if (params) {\n' +
        'const TraversingQuery = params.smth \n' +
        'params.smth = new ESLTraversingQuery(); \n' +
        '}',
    }
  ],
  invalid: [
    {
      code: 'import {TraversingQuery} from \'../../esl-traversing-query/core\';',
      errors: [
        '[ESL Lint]: Deprecated alias TraversingQuery for ESLTraversingQuery'
      ],
      output: 'import {ESLTraversingQuery} from \'../../esl-traversing-query/core\';'
    },
    {
      code: 'import {TraversingQuery} from \'../../../src/modules/esl-traversing-query/core\';\n' +
        'if (params) {\n' +
        'const TraversingQuery = params.smth \n' +
        'params.smth = new TraversingQuery(); \n' +
        '}',
      errors: [
        '[ESL Lint]: Deprecated alias TraversingQuery for ESLTraversingQuery'
      ],
      output: 'import {ESLTraversingQuery} from \'../../../src/modules/esl-traversing-query/core\';\n' +
        'if (params) {\n' +
        'const TraversingQuery = params.smth \n' +
        'params.smth = new ESLTraversingQuery(); \n' +
        '}'
    },
  ]
});
