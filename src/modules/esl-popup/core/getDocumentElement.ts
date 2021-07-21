export function getDocumentElement(element: Element | Window): Element {
  return ((element instanceof Window
    ? element.document
    : element.ownerDocument) || window.document).documentElement;
}
