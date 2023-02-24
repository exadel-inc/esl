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
      '@typescript-eslint/parser': ['.ts', '.js', '.tsx', '.jsx']
    }
  },
  fixable: 'code'
};

/**
 * Builds deprecation rule
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
  return (fixer) => {
    const ranges = getIdentifierRanges(node, context);
    return ranges.map(range => fixer.replaceTextRange(range, alias));
  }
}

/**
 * @param {object} context - AST tree object
 * @param {object} importNode - import node to process
 * @returns {[number, number][]}
 */
function getIdentifierRanges(importNode, context) {
  const root = getRoot(importNode);
  const {name} = importNode.imported;
  const identifiers = collectIdentifiers(context, root, name);

  const overrides = [];
  const occurrences = new Set();

  for (const idNode of identifiers) {
    const {parent} = idNode;
    if (parent.type === 'MemberExpression') {
      if (parent.object.name === name) occurrences.add(parent.object);
    } else if (parent.type === 'VariableDeclarator') {
      overrides.push(parent);
    } else {
      occurrences.add(idNode);
    }
  }

  for (const declaration of overrides) {
    const scope = getScopeNode(declaration);
    if (!scope) continue;
    const nestedNodes = collectIdentifiers(context, scope, name);
    for (const node of nestedNodes) {
      if (node.parent.type !== 'ImportSpecifier') {
        occurrences.delete(node);
      }
    }
    const initExpNodes = collectIdentifiers(context, declaration.init, name);
    for (const node of initExpNodes) {
      occurrences.add(node);
    }
  }

  return getRanges(occurrences);
}

function collectIdentifiers(context, root, alias) {
  const identifiers = [];
  traverse(context, root, (path) => {
    if (path.node.type !== 'Identifier' || path.node.name && path.node.name !== alias) return;
    identifiers.push(path.node);
  });
  return identifiers;
}

function getScopeNode(declaration) {
  let node = declaration.parent;
  if (!node) return null;
  const isBlockScoped = node.kind && (node.kind === 'const' || node.kind === 'let');
  while (node.parent !== null) {
    node = node.parent;
    if (node.type === 'BlockStatement' && (isBlockScoped || node.parent?.type === 'FunctionExpression')) return node;
  }
  return node;
}

function getRanges(nodes) {
  const uniqNodes = [];
  for (const node of nodes) {
    if (!uniqNodes.some((item) => String(item.range) === String(node.range))) {
      uniqNodes.push(node);
    }
  }
  return uniqNodes.map((node) => node.range);
}

/** Find the root node in the tree */
function getRoot(node) {
  while (node.parent !== null) {
    node = node.parent;
  }
  return node;
}
