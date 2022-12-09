'use strict';

const meta = {
  type: 'suggestion',

  docs: {
    description: 'replace deprecated aliases',
    recommended: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.js']
    }
  },
  fixable: 'code'
};

/**
 * @property {string} alias - current name
 * @property {string} deprecation - deprecated name
 */

/**
 * @param {string} alias - current name
 * @param {string} importedName - deprecated alias in node
 * @param {object} rangeId - range of deprecated alias in node
 * @param {object} context - element for which to get context
 * @param {object} node - element for which to get node
 */

const reportAndFix = (importedName, rangeId, context, alias, node) => {
  context.report({
    node,
    message: `[ESL Lint]: Deprecated alias ${importedName} for ${alias}`,
    fix(fixer) {
      return fixer.replaceTextRange(rangeId, alias);
    }
  });
};

/**
 * @param {string} deprecation - deprecated name
 * @param {string} name - current name
 */

module.exports.buildRule = function buildRule({alias, deprecation}) {
  function isDeprecated(node, name, context) {
    const sourceCode = context.getSourceCode();
    let currentNode = node.parent;
    while (currentNode !== null) {
      if (currentNode.type === "ImportDeclaration") {
        return true;
      } else if (currentNode.type === "Program") {
        const importStatements = currentNode.body
          .filter((item) => item.type === "ImportDeclaration")
          .map((item) => sourceCode.text.substring(item.range[0], item.range[1]))
          .filter((item) => item.includes(name));
        return importStatements.length > 0;
      }
      currentNode = currentNode.parent;
    }
    return false;
  }
  const create = (context) => ({
    Identifier(node) {
      if (node.name === deprecation) {
        if (isDeprecated(node, node.name, context)) {
          reportAndFix(node.name, node.range, context, alias, node);
        }
        return null;
      }
    },
  });
  return {meta, create};
};
