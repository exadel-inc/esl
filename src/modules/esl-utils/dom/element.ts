import {getWindow} from './window';

/**
 * Get an object containing the values of all CSS properties of an element.
 * @param element - element for which to get the computed style
 * */
export function getComputedStyle(element: Element): CSSStyleDeclaration {
  return getWindow(element).getComputedStyle(element);
}

/**
 * Get the Element that is the root element of the document.
 * @param element - element for which to get the document element
 * */
export function getDocumentElement(element: Element | Window): Element {
  return ((element instanceof Window
    ? element.document
    : element.ownerDocument) || window.document).documentElement;
}

/**
 * Get the name of node.
 * @param element - element for which to get the name
 */
export function getNodeName(element?: Node | Window): string {
  return element && !(element instanceof Window)? (element.nodeName).toLowerCase() : '';
}

/**
 * Get the parent of the specified element in the DOM tree.
 * @param element - element for which to get the parent
 */
export function getParentNode(element: Element | ShadowRoot): Node {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (element instanceof ShadowRoot
    ? element.host
    : element.assignedSlot || element.parentNode) || getDocumentElement(element as Element);
}
