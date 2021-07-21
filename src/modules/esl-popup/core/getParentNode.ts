import {getNodeName} from './getNodeName';
import {getDocumentElement} from './getDocumentElement';

export function getParentNode(element: Element | ShadowRoot): Node {
  if (getNodeName(element) === 'html') {
    return element;
  }

  return (element instanceof ShadowRoot
    ? element.host
    : element.assignedSlot || element.parentNode) || getDocumentElement(element as Element);
}
