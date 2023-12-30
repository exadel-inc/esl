import {RuleTester} from 'eslint';
import {buildRule} from '../src/core/deprecated-alias';

const INVALID_CASES = [
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
    `
  },
  {
    code: `
      import {DeprecatedClassName as FN} from '../rules/4.0.0/test';
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName as FN} from '../rules/4.0.0/test';
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = params.smth;
        const instance = new DeprecatedClassName();
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = params.smth;
        const instance = new DeprecatedClassName();
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      if (params) {
        params.DeprecatedClassName = params.smth;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      if (params) {
        params.DeprecatedClassName = params.smth;
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = DeprecatedClassName;
      }
      if (params) {
        let DeprecatedClassName = DeprecatedClassName;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = AllowedClassName;
      }
      if (params) {
        let DeprecatedClassName = AllowedClassName;
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      function f(params) {
        var DeprecatedClassName = DeprecatedClassName;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      function f(params) {
        var DeprecatedClassName = AllowedClassName;
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      function f(params) {
        return DeprecatedClassName;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      function f(params) {
        return AllowedClassName;
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = Array;
        const instance = new DeprecatedClassName;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      if (params) {
        const DeprecatedClassName = Array;
        const instance = new DeprecatedClassName;
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      if (DeprecatedClassName.test()) {
         // Hi
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      if (AllowedClassName.test()) {
         // Hi
      }
    `
  },
  {
    code: `
      import {DeprecatedClassName} from '../rules/4.0.0/test';
      function f(params) {
        const DeprecatedClassName = Array;
        const instance = new DeprecatedClassName;
        return instance == DeprecatedClassName ? DeprecatedClassName : instance;
      }
    `,
    errors: [
      '[ESL Lint]: Deprecated alias DeprecatedClassName for AllowedClassName'
    ],
    output: `
      import {AllowedClassName} from '../rules/4.0.0/test';
      function f(params) {
        const DeprecatedClassName = Array;
        const instance = new DeprecatedClassName;
        return instance == DeprecatedClassName ? DeprecatedClassName : instance;
      }
    `
  }
];

// Test Runner
describe('ESL Migration Rules: Deprecated Alias: invalid', () => {
  const rule = buildRule({
    alias: 'AllowedClassName',
    deprecation: 'DeprecatedClassName',
  });

  const ruleTester = new RuleTester({
    parser: require.resolve('@typescript-eslint/parser')
  });

  ruleTester.run('../base-rules/deprecated-alias', rule, {valid: [], invalid: INVALID_CASES});
});
