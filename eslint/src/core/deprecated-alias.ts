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

/**
 * Builds deprecation rule
 * @param context - AST tree object
 * @param node - import node to process
 * @param alias - current name
 */
export function buildRule({deprecation, alias}: ESLintDeprecationCfg): Rule.RuleModule {
  const create = (context: Rule.RuleContext): Rule.RuleListener => ({
    ImportSpecifier(node: ImportNode): null {
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
}

/**
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
 * @param context - AST tree object
 * @param importNode - import node to process
 * @returns
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function getIdentifierRanges(importNode: ImportNode, context: Rule.RuleContext): (AST.Range | undefined)[] {
  const root = findRoot(importNode);
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
