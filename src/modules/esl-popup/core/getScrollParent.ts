import {getNodeName} from './getNodeName';
import {isScrollParent} from './isScrollParent';
import {getParentNode} from './getParentNode';

export function getScrollParent(node: Node): Element {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument?.body as Element;
  }

  if (node instanceof HTMLElement && isScrollParent(node as Element)) {
    return node as Element;
  }

  return getScrollParent(getParentNode(node as Element));
}
