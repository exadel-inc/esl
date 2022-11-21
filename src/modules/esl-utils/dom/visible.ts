import {getNodeName, getParentNode} from './api';
import {getWindowRect} from './window';

export interface VisibilityOptions {
  /** Element will be considered invisible if display set to 'none' */
  display?: boolean;
  /** Element will be considered invisible if opacity set to '0' */
  opacity?: boolean;
  /** Element will be considered invisible if visibility set to 'hidden' */
  visibility?: boolean;
  /** Element will be considered invisible if it's height or width is '0' */
  size?: boolean;
}

/**
 * Get the parent of the specified element with matching styles
 * @param el - element for which to get the parent
 * @param matchStyles - object of styles for comparing
 */
export function findParentByStyles(el: HTMLElement, matchStyles: Partial<CSSStyleDeclaration>): HTMLElement | undefined {
  const styleNames = Object.keys(matchStyles);
  if (!styleNames.length) return undefined;

  const elementStyle = window.getComputedStyle(el);
  if (styleNames.some((styleName: any) => elementStyle[styleName] === matchStyles[styleName])) return el;
  if (getNodeName(el) === 'html') return undefined;
  return findParentByStyles(getParentNode(el) as HTMLElement, matchStyles);
}

/**
 * Check if specified element is visible
 * @param el - element to be checked
 * @param options - object of additional visibility options to include
 */
export function isVisible(el: HTMLElement, options: VisibilityOptions = {visibility: true, opacity: false, display: false, size: false}): boolean {
  const rects = el.getClientRects();
  if (!rects.length) return false;
  // Check if element in viewport
  const rect = rects[0];
  const wndRect = getWindowRect();
  if (!(rect.top < wndRect.bottom && rect.top > wndRect.top || rect.bottom < wndRect.bottom && rect.bottom > wndRect.top)) return false;

  if (options.size && rect.height * rect.width === 0) return false;

  const {display, visibility, opacity} = options;
  if (!(display || visibility || opacity)) return true;
  const parentStyles = Object.assign({},
    display && {display: 'none'},
    visibility && {visibility: 'hidden'},
    opacity && {opacity: '0'}) as Partial<CSSStyleDeclaration>;
  return !findParentByStyles(el, parentStyles);
}
