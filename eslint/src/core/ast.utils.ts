import {traverseNodes} from './ast.traverse';

import type {Rule} from 'eslint';
import type {BaseNode} from './ast.traverse';

export * from './ast.traverse';

/** Finds the root node in the tree */
export function findRoot(node: BaseNode): BaseNode {
  while (node.parent) node = node.parent;
  return node;
}

/** Collect all current and nested AST nodes */
export function collectAll(context: Rule.RuleContext, root: BaseNode | null | undefined): BaseNode[] {
  return [...traverseNodes(context, root)].map((path) => path.node);
}

/** Find all AST nodes by shape */
export function findAllBy(context: Rule.RuleContext, root: BaseNode | null | undefined, shape: Partial<BaseNode>): BaseNode[] {
  const result: BaseNode[] = [];
  for (const node of traverseNodes(context, root)) {
    const {node: current} = node;
    if (Object.keys(shape).every((key: keyof BaseNode) => current[key] === shape[key])) {
      result.push(current);
    }
  }
  return result;
}
