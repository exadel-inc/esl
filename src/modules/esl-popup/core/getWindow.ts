export function getWindow(node: Node | Window): Window {
  if (node == null) {
    return window;
  }

  if (node instanceof Window) {
    return node;
  }

  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView || window : window;
}
