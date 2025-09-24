import {findRoot, findAllBy} from '../core/ast.utils.js';

/**
 * Creates fixe-list for the node of incorrect import
 * @param context - AST tree object
 * @param node - import node to process
 * @param alias - current name
 */
function buildFixer(node, context, alias) {
  return (fixer) => {
    const ranges = getIdentifierRanges(node, context);
    return ranges.map((range) => fixer.replaceTextRange(range, alias));
  };
}

/**
 * Find usage's ranges of the deprecated alias
 * @param context - AST tree object
 * @param importNode - import node to process
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getIdentifierRanges(importNode, context) {
  const root = findRoot(importNode);
  if (importNode.imported.type !== 'Identifier' || !root) {
    return [];
  }
  const {name} = importNode.imported;
  const identifiers = findAllBy(context, root, {type: 'Identifier', name});
  const overrides = [];
  const occurrences = new Set();
  for (const idNode of identifiers) {
    const {parent} = idNode;
    if (parent?.type === 'MemberExpression') {
      if (parent.object.name === name) {
        occurrences.add(parent.object);
      }
    } else if (parent?.type === 'VariableDeclarator') {
      overrides.push(parent);
    } else {
      occurrences.add(idNode);
    }
  }
  for (const declaration of overrides) {
    const scope = getScopeNode(declaration);
    if (!scope) continue;
    const nestedNodes = findAllBy(context, scope, {type: 'Identifier', name});
    for (const node of nestedNodes) {
      if (node.parent?.type !== 'ImportSpecifier') {
        occurrences.delete(node);
      }
    }
    const initExpNodes = findAllBy(context, declaration.init, {type: 'Identifier', name});
    for (const node of initExpNodes) {
      occurrences.add(node);
    }
  }
  return getRanges(occurrences);
}

function getScopeNode(declaration) {
  let node = declaration.parent;
  if (!node) return null;
  const isBlockScoped = node.kind && (node.kind === 'const' || node.kind === 'let');
  while (node.parent) {
    node = node.parent;
    if (node.type === 'BlockStatement' && (isBlockScoped || node.parent?.type === 'FunctionExpression')) {
      return node;
    }
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

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'replace deprecated aliases',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        patternProperties: {
          '.*': {type: 'string'}
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const mapping = context.options[0];
    if (!mapping || typeof mapping !== 'object' || Array.isArray(mapping)) return {};
    const entries = Object.entries(mapping)
      .filter(([deprecated, alias]) => typeof deprecated === 'string' && typeof alias === 'string');
    if (!entries.length) return {};
    return {
      ImportSpecifier(node) {
        const importedValue = node.imported;
        if (importedValue.type !== 'Identifier') return null;
        for (const [deprecated, alias] of entries) {
          if (importedValue.name === deprecated) {
            context.report({
              node,
              message: `[ESL Lint]: Deprecated alias ${deprecated} for ${alias}`,
              fix: buildFixer(node, context, alias)
            });
            break;
          }
        }
        return null;
      }
    };
  }
};
