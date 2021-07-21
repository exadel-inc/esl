import {getScrollParent} from './getScrollParent';
import {getParentNode} from './getParentNode';
import {isScrollParent} from './isScrollParent';

/*
given a DOM element, return the list of all scroll parents, up the list of ancesors
until we get to the top window object. This list is what we attach scroll listeners
to, because if any of these parent elements scroll, we'll need to re-calculate the
reference element's position.
*/
export function listScrollParents(element: Node, list: Element[] = []): Element[] {
  const scrollParent = getScrollParent(element);
  const isBody = scrollParent === element.ownerDocument?.body;
  const target = isBody
    ? isScrollParent(scrollParent) ? scrollParent : []
    : scrollParent;

  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(listScrollParents(getParentNode(scrollParent)));
}
