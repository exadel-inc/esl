import {Rect} from './rect';

/**
 * Gets the window object associated with a document of the specified element.
 * @param node - element for which to get window
 * */
export function getWindow(node: Node | Window): Window {
  if (node === null) return window;
  if (node instanceof Window) return node;
  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView || window : window;
}

/**
 * Gets the size and position of the window (size also accounts for the height of
 * the horizontal scrollbar and width of the vertical scrollbar, if they are visible).
 */
export function getWindowRect(wnd: Window = window): Rect {
  return Rect.from({
    x: wnd.scrollX,
    y: wnd.scrollY,
    width: wnd.innerWidth,
    height: wnd.innerHeight
  });
}

/**
 * Gets the size and position of the viewport (like window rect but excluding
 * the size of rendered scrollbars if any)
 */
export function getViewportRect(wnd: Window = window): Rect {
  return Rect.from({
    x: wnd.scrollX,
    y: wnd.scrollY,
    width: wnd.document.documentElement.clientWidth,
    height: wnd.document.documentElement.clientHeight
  });
}
