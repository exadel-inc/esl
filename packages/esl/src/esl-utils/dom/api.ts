import {isObject, isPlainObject} from '../misc/object/types';

/** Checks that passed value is an DOM Element Node */
export const isElement = (el: any): el is Element => {
  return isObject(el) && el.nodeType === 1 && !isPlainObject(el);
};

/**
 * Get the Element that is the root element of the document.
 * @param element - element for which to get the document element
 * */
export const getDocument = (element: Element | Window = window): Element => {
  return (element instanceof Window ? element.document : element.ownerDocument).documentElement;
};

/**
 * Get the name of node.
 * @param element - element for which to get the name
 */
export const getNodeName = (element?: Node | Window): string  => {
  return element && !(element instanceof Window) ? (element.nodeName).toLowerCase() : '';
};

/**
 * Get the parent of the specified element in the DOM tree.
 * @param element - element for which to get the parent
 */
export const getParentNode = (element: Element | ShadowRoot): Node => {
  if (getNodeName(element) === 'html') return element;
  return (window.ShadowRoot
    ? element instanceof ShadowRoot
      ? element.host
      : element.assignedSlot || element.parentNode
    : element.parentNode) || getDocument(element as Element);
};

/**
 * Converts HTML string or other input to a DOM Element.
 * @param input - HTML string to parse, Element to return as-is, or array of elements to get first from
 * @returns DOM Element
 */
export const htmlToElement = (input: string | Element | Element[]): Element => {
  // Element - return as-is
  if (isElement(input)) return input;

  // Array of elements - return first
  if (Array.isArray(input)) return input[0];

  // String - parse HTML
  return (new DOMParser()).parseFromString(input, 'text/html').body.children[0];
};

