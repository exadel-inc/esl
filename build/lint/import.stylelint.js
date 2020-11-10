const stylelint = require("stylelint");

const ruleName = "esl-less/import-root";
const messages = stylelint.utils.ruleMessages(ruleName, {
  expected: "Only relative paths accepted"
});

module.exports = stylelint.createPlugin(ruleName, function (expectation) {
  return function (root, result) {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: expectation,
      possible: ["never"]
    });

    if (!validOptions) return;

    root.walkAtRules("import", decl => {
      const path = decl.params
        .replace(/^\s*(url\()?['"]?/, '')
        .replace(/['"]?\s*$/, '');

      // Referencing file from the same directory
      if (path.indexOf('/') === -1) return;

      // Relative path
      if (path.startsWith('.')) return;

      // Others are not acceptable
      stylelint.utils.report({
        message: messages.expected,
        node: decl,
        result,
        ruleName
      });
    });
  };
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
