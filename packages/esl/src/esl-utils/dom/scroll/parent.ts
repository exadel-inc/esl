import {isElement, getNodeName, getParentNode} from '../api';

/**
 * Get the list of all scroll parents, up the list of ancestors until we get to the top window object.
 * @param element - element for which you want to get the list of all scroll parents
 * @param root - element which element considered a final scrollable parent target (optional, defaults to element.ownerDocument?.body)
 */
export function getListScrollParents(element: Element, root?: Element): Element[] {
  const limitNode = root || element.ownerDocument?.body;
  const scrollParent = getScrollParent(element, limitNode);
  if (!scrollParent) return [];
  const isScrollableTarget = scrollParent === limitNode;
  if (isScrollableTarget) return isScrollable(scrollParent) ? [scrollParent] : [];
  return [scrollParent].concat(getListScrollParents(getParentNode(scrollParent) as Element, limitNode));
}

/**
 * Get the scroll parent of the specified element in the DOM tree.
 * @param node - element for which to get the scroll parent
 * @param root - element which element considered a final scrollable parent
 */
export function getScrollParent(node: Element, root: Element): Element | undefined;
/**
 * Get the scroll parent of the specified element in the DOM tree.
 * @param node - element for which to get the scroll parent
 */
export function getScrollParent(node: Element): Element;
export function getScrollParent(node: Element, root?: Element): Element | undefined {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument?.body as Element;
  }

  if (isElement(node) && isScrollable(node)) return node;
  if (node === root) return;
  return getScrollParent(getParentNode(node) as Element, root!);
}

/**
 * Check that element is scroll parent.
 * @param element - element for checking
 * */
export function isScrollable(element: Element): boolean {
  // Firefox wants us to check `-x` and `-y` variations as well
  const {overflow, overflowX, overflowY} = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

/**
 * Get the element that is the viewport for the specified element.
 * @param node - element for which to get the viewport
 */
export function getViewportForEl(node: Element): Element | undefined {
  return getListScrollParents(node).find((el) => el.scrollHeight !== el.clientHeight);
}
