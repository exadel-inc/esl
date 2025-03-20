import stylelint from 'stylelint';

const {validateOptions, ruleMessages, report} = stylelint.utils;

const trimPath = (path) => path
  .replace(/^\s*(url\()?['"]?/, '')
  .replace(/['"]?\)?\s*$/, '')
  .trim();

const getMsgBase = (type, opt) => {
  if (typeof opt === 'string') return opt;
  if (typeof opt?.message === 'string') return opt.message;
  return `Only ${type} paths should be used`;
};

/**
 * Custom stylelint rule to prevent using absolute/relative paths in @import directive
 *
 * @typedef {'off' | 'absolute' | 'relative'} ESLImportRuleType
 *
 * @typedef {Object} ESLImportRuleOpt
 * @property {string} [severity='error'] - Rule severity
 * @property {string} [message] - Custom message
 *
 * @param {ESLImportRuleType} type - Rule type
 * @param {ESLImportRuleOpt} [opt] - Rule options
 */
function importRuleFn(type, opt) {
  return (root, result) => {
    const {ruleName, messages} = importRuleFn;
    const isValid = validateOptions(result, ruleName, {
      actual: type,
      possible: ['off', 'absolute', 'relative']
    });

    // Skip if rule is disabled
    if (!isValid || type === 'off') return;

    // Rule message
    const severity = opt?.severity || 'error';

    root.walkAtRules('import', (node) => {
      const path = trimPath(node.params);
      const isRelative = path.startsWith('.') || !path.includes('/');

      // Absolute path
      if (type === 'absolute' && isRelative) {
        const message = messages.rejected(type, opt, path);
        report({message, node, result, severity, ruleName});
      }

      // Relative path
      if (type === 'relative' && !isRelative) {
        const message = messages.rejected(type, opt, path);
        report({message, node, result, severity, ruleName});
      }
    });
  };
}

importRuleFn.ruleName = '@esl/import-type';
importRuleFn.messages = ruleMessages(importRuleFn.ruleName, {
  /**
   * @param {ESLImportRuleType} type
   * @param {ESLImportRuleOpt} opt
   * @param {string} path
   */
  rejected: (type, opt, path) => getMsgBase(type, opt).replace('{path}', path)
});

export default stylelint.createPlugin(importRuleFn.ruleName, importRuleFn);
