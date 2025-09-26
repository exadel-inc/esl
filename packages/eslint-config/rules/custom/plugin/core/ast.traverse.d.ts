import type * as ESTree from 'estree';
import type { Rule } from 'eslint';
export type BaseNode = (ESTree.Expression | ESTree.Node) & {
    kind?: string;
    parent?: BaseNode;
};
type TraverseLocation = {
    parent: BaseNode | null;
    parentKey: string | null;
    parentPath: TraverseNode | null;
};
export type TraverseNode = TraverseLocation & {
    node: BaseNode;
};
export declare function traverseNodes(context: Rule.RuleContext, root: BaseNode | null | undefined): Generator<TraverseNode>;
export {};
