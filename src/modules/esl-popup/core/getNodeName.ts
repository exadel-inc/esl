export function getNodeName(element?: Node | Window): string {
  return element && !(element instanceof Window)? (element.nodeName).toLowerCase() : '';
}
