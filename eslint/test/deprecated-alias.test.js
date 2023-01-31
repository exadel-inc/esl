'use strict';

const alias = 'currentName';
const deprecation = 'deprecatedName';

const rule = require('../base-rules/deprecated-alias').buildRule({
  alias: alias,
  deprecation: deprecation,
});
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser')
});

ruleTester.run('../base-rules/deprecated-alias', rule, {
  valid: [
    {code: `import {${alias}} from \'../rules/4.0.0/test\';`},
    {code: `import {${alias} as FN}  from \'../rules/4.0.0/test\';`},
    {
      code: `if (${alias}.one() && FN.one(\'data\')) { \n
         const ${deprecation} = \'data\'; \n
         } \n`
    },
    {
      code: `import ${alias} from \'../rules/4.0.0/test\'; \n
        if (params) { \n
        const ${deprecation} = params.smth \n
        params.smth = new ${alias}(); \n
        }`,
    }
  ],
  invalid: [
    {
      code: `import {${deprecation}} from \'../rules/4.0.0/test\';`,
      errors: [
        `[ESL Lint]: Deprecated alias ${deprecation} for ${alias}`
      ],
      output: `import {${alias}} from \'../rules/4.0.0/test\';`
    },
    {
      code: `import {${deprecation}} from \'../rules/4.0.0/test\'; \n
        if (params) { \n
        const ${deprecation} = params.smth \n
        params.smth = new ${deprecation}(); \n
        }`,
      errors: [
        `[ESL Lint]: Deprecated alias ${deprecation} for ${alias}`
      ],
      output: `import {${alias}} from \'../rules/4.0.0/test\'; \n
        if (params) { \n
        const ${deprecation} = params.smth \n
        params.smth = new ${alias}(); \n
        }`
    },
  ]
});
