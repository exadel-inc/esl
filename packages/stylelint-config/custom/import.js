/**
 * Custom stylelint rule to prevent using absolute/relative paths in @import directive
 */
import stylelint from 'stylelint';

const RULE_NAME = '@esl/import-type';

const trimPath = (path) => path
  .replace(/^\s*(url\()?['"]?/, '')
  .replace(/['"]?\)?\s*$/, '')
  .trim();

const getMsgBase = (type, opt) => {
  if (typeof opt === 'string') return opt;
  if (typeof opt?.message === 'string') return opt.message;
  return `Only ${type} paths should be used`;
};
const getMsg = (type, opt, path) => {
  return getMsgBase(type, opt).replace('{path}', path);
};

export default stylelint.createPlugin(RULE_NAME, function (type, opt) {
  return function (root, result) {
    const isValid = stylelint.utils.validateOptions(result, RULE_NAME, {
      actual: type,
      possible: ["off", "absolute", "relative"]
    });

    // Skip if rule is disabled
    if (!isValid || type === 'off') return;

    // Rule message
    const severity = opt?.severity || 'error';

    root.walkAtRules("import", (node) => {
      const path = trimPath(node.params);
      const isRelative = path.startsWith('.') || !path.includes('/');

      // Absolute path
      if (type === 'absolute' && isRelative) {
        const message = getMsg(type, opt, path);
        stylelint.utils.report({message, node, result, severity, ruleName: RULE_NAME});
      }

      // Relative path
      if (type === 'relative' && !isRelative) {
        const message = getMsg(type, opt, path);
        stylelint.utils.report({message, node, result, severity, ruleName: RULE_NAME});
      }
    });
  };
});
