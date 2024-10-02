import {findRoot, findAllBy} from './ast.utils';

import type {AST, Rule} from 'eslint';
import type * as ESTree from 'estree';
import type {BaseNode} from './ast.utils';

const meta: Rule.RuleModule['meta'] = {
  type: 'suggestion',
  docs: {
    description: 'replace deprecated aliases',
    recommended: true,
  },
  fixable: 'code'
};

export interface ESLintDeprecationCfg {
  /** Current alias name */
  alias: string;
  /** Deprecated name */
  deprecation: string;
}

type ImportNode = ESTree.ImportSpecifier & Rule.NodeParentExtension;

/** Builds deprecation rule from {@link ESLintDeprecationCfg} object */
export function buildRule(configs: ESLintDeprecationCfg | ESLintDeprecationCfg[]): Rule.RuleModule {
  configs = Array.isArray(configs) ? configs : [configs];
  const create = (context: Rule.RuleContext): Rule.RuleListener => ({
    ImportSpecifier(node: ImportNode): null {
      const importedValue = node.imported;
      configs.forEach((config) => {
        if (importedValue.type === 'Identifier' && importedValue.name === config.deprecation) {
          context.report({
            node,
            message: `[ESL Lint]: Deprecated alias ${config.deprecation} for ${config.alias}`,
            fix: buildFixer(node, context, config.alias)
          });
        }
      });
      return null;
    }
  });

  return {meta, create};
}

/**
 * Creates fixe-list for the node of incorrect import
 * @param context - AST tree object
 * @param node - import node to process
 * @param alias - current name
 */
function buildFixer(node: ImportNode, context: Rule.RuleContext, alias: string): (fixer: Rule.RuleFixer) => Rule.Fix[] {
  return (fixer: Rule.RuleFixer) => {
    const ranges = getIdentifierRanges(node, context);
    return ranges.map((range) => fixer.replaceTextRange(range!, alias));
  };
}

/**
 * Find usage's ranges of the deprecated alias
 * @param context - AST tree object
 * @param importNode - import node to process
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getIdentifierRanges(importNode: ImportNode, context: Rule.RuleContext): (AST.Range | undefined)[] {
  const root = findRoot(importNode);
  if (importNode.imported.type !== 'Identifier' || !root) return [];

  const {name} = importNode.imported;
  const identifiers = findAllBy(context, root, {type: 'Identifier', name});

  const overrides = [];
  const occurrences = new Set<ESTree.Node>();

  for (const idNode of identifiers) {
    const {parent} = idNode;
    if (parent?.type === 'MemberExpression') {
      if ((parent.object as ESTree.Identifier).name === name) occurrences.add(parent.object);
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

function getScopeNode(declaration: BaseNode): BaseNode | null {
  let node = declaration.parent;
  if (!node) return null;
  const isBlockScoped = node.kind && (node.kind === 'const' || node.kind === 'let');
  while (node.parent) {
    node = node.parent;
    if (node.type === 'BlockStatement' && (isBlockScoped || node.parent?.type === 'FunctionExpression')) return node;
  }
  return node;
}

function getRanges<T extends ESTree.Node>(nodes: Set<T>): ([number, number] | undefined)[] {
  const uniqNodes: T[] = [];
  for (const node of nodes) {
    if (!uniqNodes.some((item) => String(item.range) === String(node.range))) {
      uniqNodes.push(node);
    }
  }
  return uniqNodes.map((node) => node.range);
}
