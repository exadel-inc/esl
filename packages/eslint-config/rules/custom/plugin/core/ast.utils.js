import { traverseNodes } from './ast.traverse.js';
export * from './ast.traverse.js';
/** Finds the root node in the tree */
export function findRoot(node) {
    while (node.parent) node = node.parent;
    return node;
}
/** Collect all current and nested AST nodes */
export function collectAll(context, root) {
    return [...traverseNodes(context, root)].map((path) => path.node);
}
/** Find all AST nodes by shape */
export function findAllBy(context, root, shape) {
    const result = [];
    for (const node of traverseNodes(context, root)) {
        const { node: current } = node;
        if (Object.keys(shape).every((key) => current[key] === shape[key])) {
            result.push(current);
        }
    }
    return result;
}
