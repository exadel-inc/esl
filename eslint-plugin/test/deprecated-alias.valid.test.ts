import {RuleTester} from 'eslint';
import {buildRule} from '../src/core/deprecated-alias';

const VALID_CASES = [
  {
    code: `
      import {AllowedClassName} from "../rules/4.0.0/test";
    `
  },
  {
    code: `
      import {AllowedClassName as FN}  from '../rules/4.0.0/test';
      FN.test();
    `
  },
  {
    code: `
      import {AllowedClassName as FN}  from '../rules/4.0.0/test';
      if (window.AllowedClassName) {  console.log('Hi'); }
    `
  },
  {
    code: `
      import {AllowedClassName as FN}  from '../rules/4.0.0/test';
      if (AllowedClassName.one() && FN.one('data')) { // Exception but not related
        // Something
      }
    `
  },
  {
    code: `
      import {AllowedClassName}  from '../rules/4.0.0/test';

      /** \`DeprecatedClassName\` is an alias for \`AllowedClassName\` */
      export default function() {
         // for DeprecatedClassName
      }
    `
  },
  {
    code: `
      const DeprecatedClassName = 1;
      if (true) {
        let DeprecatedClassName = 1;
      }
      if (true) {
        const DeprecatedClassName = 1;
      }
      function f() {
        var DeprecatedClassName = 1;
      }
    `
  },
  {
    code: `
      import DeprecatedClassName from '../rules/4.0.0/test';
      if (params) {
         const DeprecatedClassName = params.smth
         params.DeprecatedClassName = new DeprecatedClassName();
      }
    `
  }
];

// Test Runner
describe('ESL Migration Rules: Deprecated Alias: valid', () => {
  const rule = buildRule({
    alias: 'AllowedClassName',
    deprecation: 'DeprecatedClassName',
  });

  const ruleTester = new RuleTester();
  ruleTester.run('deprecated-alias', rule, {valid: VALID_CASES, invalid: []});
});
