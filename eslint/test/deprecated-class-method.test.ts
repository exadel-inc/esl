import {RuleTester} from 'eslint';
import {buildRule} from '../src/core/deprecated-class-method';

import deprecatedMediaRuleListParse from '../src/rules/4/deprecated.media-rule-list-parse';

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

const INVALID_CASES_TEST_CLASS = [
  {
    code: `
      TestClass.oldMethod();
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use newMethodNoArgs instead'
    ],
    output: `
      TestClass.oldMethod();
    `
  }, {
    code: `
      TestClass.oldMethod(1, () => {});
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use newMethodMultipleArgsNonLiteral instead'
    ],
    output: `
      TestClass.newMethodMultipleArgsNonLiteral(1, () => {});
    `
  }, {
    code: `
      TestClass.oldMethod('test');
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use newMethodOneArg instead'
    ],
    output: `
      TestClass.newMethodOneArg('test');
    `
  }, {
    code: `
      TestClass.oldMethod('test', 42);
    `,
    errors: [
      '[ESL Lint]: Deprecated static method TestClass.oldMethod, use newMethodMultipleArgs instead'
    ],
    output: `
      TestClass.newMethodMultipleArgs('test', 42);
    `
  }
];

const INVALID_CASES_RULE_LIST = [
  {
    code: `
      const t = ESLMediaRuleList.parse;
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseQuery or ESLMediaRuleList.parseTuple instead'
    ],
    output: `
      const t = ESLMediaRuleList.parse;
    `
  }, {
    code: `
      ESLMediaRuleList.parse;
    `,
    errors: [
      '[ESL Lint]: Deprecated static method ESLMediaRuleList.parse, use ESLMediaRuleList.parseQuery or ESLMediaRuleList.parseTuple instead'
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
  }
];

describe('ESL Migration Rules: Deprecated Static Method: valid', () => {
  const rule = buildRule({
    className: 'TestClass',
    deprecatedMethod: 'oldMethod',
    getReplacementMethod: (expression) => {
      const args = expression.arguments;
      if (args.length === 0) return {message: 'newMethodNoArgs'};

      let methodName;
      if (args.length === 1) methodName = 'newMethodOneArg';
      else if (args.length > 1 && args[args.length - 1].type !== 'Literal' && args[args.length - 1].type !== 'TemplateLiteral') {
        methodName = 'newMethodMultipleArgsNonLiteral';
      }
      else methodName = 'newMethodMultipleArgs';
      return {message: methodName, replacement: methodName};
    }
  });

  const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser')
  });

  ruleTester.run('deprecated-static-method', rule, {valid: VALID_CASES, invalid: INVALID_CASES_TEST_CLASS});
});

describe('ESL Migration Rules: Deprecated Static Method: valid', () => {
  const rule = deprecatedMediaRuleListParse;

  const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser')
  });

  ruleTester.run('deprecated-static-method', rule, {valid: VALID_CASES, invalid: INVALID_CASES_RULE_LIST});
});
