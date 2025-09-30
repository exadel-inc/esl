const wrapNode = (node, location = {parent: null, parentKey: null, parentPath: null}) =>
  Object.assign({}, location, {node});

export function* traverseNodes(context, root) {
  const allVisitorKeys = context.sourceCode.visitorKeys || {};
  const queue = [];
  root && queue.push(wrapNode(root));
  while (queue.length) {
    const current = queue.shift();
    yield current;
    const visitorKeys = allVisitorKeys[current.node.type];
    if (!visitorKeys) continue;
    for (const visitorKey of visitorKeys) {
      const child = current.node[visitorKey];
      if (!child) continue;
      const location = {
        parent: current.node,
        parentKey: visitorKey,
        parentPath: current
      };
      [].concat(child).forEach((node) => queue.push(wrapNode(node, location)));
    }
  }
}
