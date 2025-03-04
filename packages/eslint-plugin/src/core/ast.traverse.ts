import type * as ESTree from 'estree';
import type {Rule, SourceCode} from 'eslint';

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

const wrapNode = (
  node: BaseNode,
  location: TraverseLocation = {parent: null, parentKey: null, parentPath: null}
): TraverseNode => Object.assign({}, location, {node});

export function* traverseNodes(context: Rule.RuleContext, root: BaseNode | null | undefined): Generator<TraverseNode> {
  const allVisitorKeys: SourceCode.VisitorKeys = context.sourceCode.visitorKeys || {};
  const queue: TraverseNode[] = [];

  root && queue.push(wrapNode(root));

  while (queue.length) {
    const current = queue.shift()!;
    yield current;

    const visitorKeys = allVisitorKeys[current.node.type];
    if (!visitorKeys) continue;

    for (const visitorKey of visitorKeys) {
      const child = current.node[visitorKey as keyof BaseNode] as BaseNode | BaseNode[] | undefined;
      if (!child) continue;

      const location: TraverseLocation = {
        parent: current.node,
        parentKey: visitorKey,
        parentPath: current
      };

      ([] as BaseNode[]).concat(child).forEach((node) => queue.push(wrapNode(node, location)));
    }
  }
}
