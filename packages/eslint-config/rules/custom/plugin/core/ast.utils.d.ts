import type { Rule } from 'eslint';
import type { BaseNode } from './ast.traverse';
export * from './ast.traverse';
/** Finds the root node in the tree */
export declare function findRoot(node: BaseNode): BaseNode;
/** Collect all current and nested AST nodes */
export declare function collectAll(context: Rule.RuleContext, root: BaseNode | null | undefined): BaseNode[];
/** Find all AST nodes by shape */
export declare function findAllBy(context: Rule.RuleContext, root: BaseNode | null | undefined, shape: Partial<BaseNode>): BaseNode[];
