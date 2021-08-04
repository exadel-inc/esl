import {Rect} from './rect';

/**
 * Get the window object associated with a document of the specified element.
 * @param node - element for which to get window
 * */
export function getWindow(node: Node | Window): Window {
  if (node == null) {
    return window;
  }

  if (node instanceof Window) {
    return node;
  }

  const ownerDocument = node.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView || window : window;
}

/**
 * Get the bottom coordinate value of the window.
 * */
export function getWindowBottom(): number {
  return window.pageYOffset + getWindowHeight();
}

/**
 * Get the left coordinate value of the window.
 * */
export function getWindowLeft(): number {
  return window.pageXOffset;
}

/**
 * Get the right coordinate value of the window.
 * */
export function getWindowRight(): number {
  return window.pageXOffset + getWindowWidth();
}

/**
 * Get the top coordinate value of the window.
 * */
export function getWindowTop(): number {
  return window.pageYOffset;
}

/**
 * Get the width of the window.
 * */
export function getWindowHeight(): number {
  return window.innerHeight || window.document.documentElement.clientHeight;
}

/**
 * Get the height of the window.
 * */
export function getWindowWidth(): number {
  return window.innerWidth || window.document.documentElement.clientWidth;
}

/**
 * Get the size and position of the window.
 * @returns
 */
export function getWindowRect(): Rect {
  return Rect.from({
    x: getWindowLeft(),
    y: getWindowTop(),
    height: getWindowHeight(),
    width: getWindowWidth()
  });
}
