'use strict';
const traverse = require('eslint-traverse');

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
 * @param {object} context - element for which to get context
 * @param {object} node - element for which to get node
 */

module.exports.buildRule = function buildRule({alias, deprecation}) {
  function getIdentifierRanges(node, context) {
    let root = node;
    let identifierRanges = [];
    while (root.parent !== null) {
      root = root.parent;
    }
    traverse(context, root, path => {
      if (path.node.type === 'Identifier' && path.node.name === deprecation) {
        const range = path.node.range;
        if (path.node.parent && path.node.parent.type === 'VariableDeclarator') {
          return false;
        } else if (!identifierRanges.find(r => r[0] === range[0] || r[1] === range[1])) {
          identifierRanges.push(range);
          return traverse.SKIP;
        }
      }
    });
    return identifierRanges;
  }
  const create = (context) => ({
    ImportSpecifier(node) {
      const importedValue = node.imported;
      if (importedValue.name === deprecation) {
        context.report({
          node,
          message: `[ESL Lint]: Deprecated alias ${deprecation} for ${alias}`,
          fix(fixer) {
            return getIdentifierRanges(node, context).map(range => fixer.replaceTextRange(range, alias));
          }
        });
      }
      return null;
    }
  });
  return {meta, create};
};
