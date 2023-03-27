'use strict';

/**
 * Custom StyleLint plugin to specify lowercase or uppercase for pseudo-element selectors.
 */

const stylelint = require('stylelint');
const isStandardSyntaxRule = require('stylelint/lib/utils/isStandardSyntaxRule');
const isStandardSyntaxSelector = require('stylelint/lib/utils/isStandardSyntaxSelector');
const { levelOneAndTwoPseudoElements } = require('stylelint/lib/reference/selectors');
const report = require('stylelint/lib/utils/report');
const transformSelector = require('stylelint/lib/utils/transformSelector');
const validateOptions = stylelint.utils.validateOptions;
const ruleMessages = stylelint.utils.ruleMessages;

const ruleName = 'esl-less/selector-pseudo-element-case';

const messages = ruleMessages(ruleName, {
  expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
  url: 'https://stylelint.io/user-guide/rules/selector-pseudo-element-case',
  fixable: true
};

/** @type {import('stylelint').Rule} */
const rule = (primary, _secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: ['lower', 'upper'],
    });

    if (!validOptions) {
      return;
    }

    root.walkRules((ruleNode) => {
      if (!isStandardSyntaxRule(ruleNode)) {
        return;
      }

      const selector = ruleNode.selector;

      if (!selector.includes(':')) {
        return;
      }

      transformSelector(result, ruleNode, (selectorTree) => {
        selectorTree.walkPseudos((pseudoNode) => {
          const pseudoElement = pseudoNode.value;

          if (!isStandardSyntaxSelector(pseudoElement)) {
            return;
          }

          if (
            !pseudoElement.includes('::') &&
            !levelOneAndTwoPseudoElements.has(pseudoElement.toLowerCase().slice(1))
          ) {
            return;
          }

          const expectedPseudoElement =
            primary === 'lower' ? pseudoElement.toLowerCase() : pseudoElement.toUpperCase();

          if (pseudoElement === expectedPseudoElement) {
            return;
          }

          if (context.fix) {
            pseudoNode.value = expectedPseudoElement;

            return;
          }

          report({
            message: messages.expected(pseudoElement, expectedPseudoElement),
            node: ruleNode,
            index: pseudoNode.sourceIndex,
            ruleName,
            result,
          });
        });
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = stylelint.createPlugin(ruleName, rule);
