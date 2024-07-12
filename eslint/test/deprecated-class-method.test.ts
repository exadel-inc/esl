import {RuleTester} from 'eslint';
import {buildRule} from '../src/core/deprecated-class-method';

const VALID_CASES = [
  {
    code: `
      ESLMediaRuleList.parseQuery('1 | 2');
    `
  }, {
    code: `
      ESLMediaRuleList.parseQuery('1 | 2', String);
    `
  }, {
    code: `
      ESLMediaRuleList.parseTuple('1 | 2', '3|4');
    `
  }, {
    code: `
      ESLMediaRuleList.parseTuple('1 | 2', '3|4', String);
    `
  }, {
    code: `
      TestClass.newMethodNoArgs();
    `
  }, {
    code: `
      TestClass.newMethodOneArg('test');
    `
  }, {
    code: `
      TestClass.newMethodMultipleArgs('test', 42);
    `
  }, {
    code: `
      TestClass.newMethodMultipleArgsNonLiteral(1, 2);
    `
  }, {
    code: `
      AnotherClass.modernMethod();
    `
  }, {
    code: `
      AnotherClass.modernMethodForManyArgs(1, 2, 3);
    `
  }, {
    code: `
      AnotherClass.modernMethod;
    `
  },  {
    code: `
      const method = AnotherClass.modernMethod;
    `
  }
];

const INVALID_CASES = [
  {
    code: `
      const t = ESLMediaRuleList.parse;
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList\'s parseQuery or parseTuple methods instead'
    ],
    output: `
      const t = ESLMediaRuleList.parse;
    `
  }, {
    code: `
      ESLMediaRuleList.parse;
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList\'s parseQuery or parseTuple methods instead'
    ],
    output: `
      ESLMediaRuleList.parse;
    `
  }, {
    code: `
      ESLMediaRuleList.parse('1 | 2');
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseQuery instead'
    ],
    output: `
      ESLMediaRuleList.parseQuery('1 | 2');
    `
  }, {
    code: `
      ESLMediaRuleList.parse('1 | 2', String);
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseQuery instead'
    ],
    output: `
      ESLMediaRuleList.parseQuery('1 | 2', String);
    `
  }, {
    code: `
      ESLMediaRuleList.parse('1 | 2', '3|4');
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseTuple instead'
    ],
    output: `
      ESLMediaRuleList.parseTuple('1 | 2', '3|4');
    `
  }, {
    code: `
      ESLMediaRuleList.parse('1 | 2', \`3|4\`);
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseTuple instead'
    ],
    output: `
      ESLMediaRuleList.parseTuple('1 | 2', \`3|4\`);
    `
  }, {
    code: `
      ESLMediaRuleList.parse('1 | 2', '3|4', String);
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseTuple instead'
    ],
    output: `
      ESLMediaRuleList.parseTuple('1 | 2', '3|4', String);
    `
  }, {
    code: `
      TestClass.oldMethod();
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use TestClass.newMethodNoArgs instead'
    ],
    output: `
      TestClass.newMethodNoArgs();
    `
  }, {
    code: `
      TestClass.oldMethod(1, () => {});
    `,
    errors: [{ message: '[ESL Lint]: Deprecated static method TestClass.oldMethod, use TestClass.newMethodMultipleArgsNonLiteral instead' }],
    output: `
      TestClass.newMethodMultipleArgsNonLiteral(1, () => {});
    `
  }, {
    code: `
      TestClass.oldMethod('test');
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use TestClass.newMethodOneArg instead'
    ],
    output: `
      TestClass.newMethodOneArg('test');
    `
  }, {
    code: `
      TestClass.oldMethod('test', 42);
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use TestClass.newMethodMultipleArgs instead'
    ],
    output: `
      TestClass.newMethodMultipleArgs('test', 42);
    `
  }
];

describe('ESL Migration Rules: Deprecated Static Method: valid', () => {
  const rule = buildRule([
    {
      className: 'ESLMediaRuleList',
      deprecatedMethod: 'parse',
      recommendedMethod: (args): string => {
        if (!args) return 'parseQuery or parseTuple';
        return args.length === 1 || (args[1]?.type !== 'Literal' && args[1]?.type !== 'TemplateLiteral') ? 'parseQuery' : 'parseTuple';
      }
    }, {
      className: 'TestClass',
      deprecatedMethod: 'oldMethod',
      recommendedMethod: (args) => {
        if (!args || args.length === 0) {
          return 'newMethodNoArgs';
        } else if (args.length === 1) {
          return 'newMethodOneArg';
        } else if (args.length > 1 && args[args.length - 1].type !== 'Literal' && args[args.length - 1].type !== 'TemplateLiteral') {
          return 'newMethodMultipleArgsNonLiteral';
        } else {
          return 'newMethodMultipleArgs';
        }
      }
    }
  ]);

  const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser')
  });

  ruleTester.run('deprecated-static-method', rule, {valid: VALID_CASES, invalid: INVALID_CASES});
});
