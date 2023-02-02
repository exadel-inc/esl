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
 * @param {object} option
 * @param {string} option.alias - current name
 * @param {string} option.deprecation - deprecated name
 */
module.exports.buildRule = function buildRule({alias, deprecation}) {
  const create = (context) => ({
    ImportSpecifier(node) {
      const importedValue = node.imported;
      if (importedValue.name === deprecation) {
        context.report({
          node,
          message: `[ESL Lint]: Deprecated alias ${deprecation} for ${alias}`,
          fix: buildFixer(node, context, alias)
        });
      }
      return null;
    }
  });
  return {meta, create};
};

/**
 * @param {object} context - AST tree object
 * @param {AST.Token.Node} node - import node to process
 * @param {string} alias - current name
 */
function buildFixer(node, context, alias) {
  return (fixer) => getIdentifierRanges(node, context).map(range => fixer.replaceTextRange(range, alias));
}

/**
 * @param {object} context - AST tree object
 * @param {object} importNode - import node to process
 * @returns {[number, number][]}
 */
function getIdentifierRanges(importNode, context) {
  const root = getRoot(importNode);
  const ranges = [];
  traverse(context, root, path => {
    if (path.node.type !== 'Identifier' || path.node.name && path.node.name !== importNode.imported.name) return;
    if (path.node.parent && path.node.parent.type === 'VariableDeclarator' || path.node.parent.type === 'MemberExpression') {
      return traverse.SKIP;
    }
    ranges.push(path.node.range);
    return traverse.SKIP;
  });
  return deduplicateRanges(ranges);
}

function getRoot(node) {
  while (node.parent !== null) {
    node = node.parent;
  }
  return node;
}

function deduplicateRanges(ranges) {
  return ranges.reduce((uniqRanges, range) => {
    if (!uniqRanges.some((item) => item[0] === range[0] && item[1] === range[1])) {
      uniqRanges.push(range);
    }
    return uniqRanges;
  }, []);
}
