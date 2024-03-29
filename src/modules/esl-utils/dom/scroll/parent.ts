import {isElement, getNodeName, getParentNode} from '../api';

/**
 * Get the list of all scroll parents, up the list of ancestors until we get to the top window object.
 * @param element - element for which you want to get the list of all scroll parents
 * @param list - array of elements to concatenate with the list of all scroll parents of element (optional)
 */
export function getListScrollParents(element: Element, list: Element[] = []): Element[] {
  const scrollParent = getScrollParent(element);
  const isBody = scrollParent === element.ownerDocument?.body;
  const target = isBody
    ? isScrollable(scrollParent) ? scrollParent : []
    : scrollParent;

  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(getListScrollParents(getParentNode(scrollParent) as Element));
}

/**
 * Get the scroll parent of the specified element in the DOM tree.
 * @param node - element for which to get the scroll parent
 */
export function getScrollParent(node: Element): Element {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument?.body as Element;
  }

  if (isElement(node) && isScrollable(node)) return node;
  return getScrollParent(getParentNode(node) as Element);
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
