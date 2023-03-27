'use strict';

/**
 * Custom StyleLint plugin to require a single space or disallow whitespace after the colon of declarations.
 */

const stylelint = require('stylelint');
const declarationColonSpaceChecker = require('stylelint/lib/rules/declarationColonSpaceChecker');
const whitespaceChecker = require("stylelint/lib/utils/whitespaceChecker");
const declarationValueIndex = stylelint.utils.declarationValueIndex;
const ruleMessages = stylelint.utils.ruleMessages;
const validateOptions = stylelint.utils.validateOptions;

const ruleName = 'esl-less/declaration-colon-space-after';

const messages = ruleMessages(ruleName, {
  expectedAfter: () => 'Expected single space after ":"',
  rejectedAfter: () => 'Unexpected whitespace after ":"',
  expectedAfterSingleLine: () => 'Expected single space after ":" with a single-line declaration',
});

const meta = {
  url: 'https://stylelint.io/user-guide/rules/declaration-colon-space-after',
  fixable: true
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  const checker = whitespaceChecker('space', primary, messages);

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['always', 'never', 'always-single-line'],
    });

    if (!validOptions) {
      return;
    }

    declarationColonSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
      fix: context.fix
        ? (decl, index) => {
          const colonIndex = index - declarationValueIndex(decl);
          const between = decl.raws.between;

          if (between == null) throw new Error('`between` must be present');

          if (primary.startsWith('always')) {
            decl.raws.between =
              between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ': ');

            return true;
          }

          if (primary === 'never') {
            decl.raws.between =
              between.slice(0, colonIndex) + between.slice(colonIndex).replace(/^:\s*/, ':');

            return true;
          }

          return false;
        }
        : null,
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = stylelint.createPlugin(ruleName, rule);

