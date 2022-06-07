import {getNodeName, getParentNode} from '../api';

/**
 * Get the list of all scroll parents, up the list of ancestors until we get to the top window object.
 * @param element - element for which you want to get the list of all scroll parents
 * @param list - array of elements to concatenate with the list of all scroll parents of element (optional)
 */
export function getListScrollParents(element: Node, list: Element[] = []): Element[] {
  const scrollParent = getScrollParent(element);
  const isBody = scrollParent === element.ownerDocument?.body;
  const target = isBody
    ? isScrollParent(scrollParent) ? scrollParent : []
    : scrollParent;

  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(getListScrollParents(getParentNode(scrollParent)));
}

/**
 * Get the scroll parent of the specified element in the DOM tree.
 * @param node - element for which to get the scroll parent
 */
export function getScrollParent(node: Node): Element {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument?.body as Element;
  }

  if (node instanceof HTMLElement && isScrollParent(node as Element)) {
    return node as Element;
  }

  return getScrollParent(getParentNode(node as Element));
}

/**
 * Check that element is scroll parent.
 * @param element - element for checking
 * */
export function isScrollParent(element: Element): boolean {
  // Firefox wants us to check `-x` and `-y` variations as well
  const {overflow, overflowX, overflowY} = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
