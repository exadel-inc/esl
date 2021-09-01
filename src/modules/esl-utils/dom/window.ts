import {Rect} from './rect';

/**
 * Get the window object associated with a document of the specified element.
 * @param node - element for which to get window
 * */
export function getWindow(node: Node | Window): Window {
  if (node === null) return window;
  if (node instanceof Window) return node;
  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView || window : window;
}

/**
 * Get the size and position of the window.
 * @returns
 */
export function getWindowRect(wnd: Window = window): Rect {
  return Rect.from({
    x: wnd.scrollX,
    y: wnd.scrollY,
    width: wnd.innerWidth || wnd.document.documentElement.clientWidth,
    height: wnd.innerHeight || wnd.document.documentElement.clientHeight
  });
}
