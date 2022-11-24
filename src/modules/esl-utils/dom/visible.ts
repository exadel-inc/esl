import {getNodeName, getParentNode} from './api';
import {getListScrollParents} from './scroll';
import type {Rect} from './rect';

export interface VisibilityOptions {
  /** Element will be considered invisible if opacity set to '0' */
  opacity?: boolean;
  /** Element will be considered invisible if visibility set to 'hidden' */
  visibility?: boolean;
  /** Element will be considered invisible if it's not in viewport */
  viewport?: boolean;
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

  const elStyle = window.getComputedStyle(el);
  if (styleNames.some((styleName: any) => elStyle[styleName] === matchStyles[styleName])) return el;
  if (getNodeName(el) === 'html') return undefined;
  return findParentByStyles(getParentNode(el) as HTMLElement, matchStyles);
}

/**
 * Check if specified element is visible
 * @param el - element to be checked
 * @param options - object of additional visibility options to include
 */
export function isVisible(el: HTMLElement, options: VisibilityOptions = {visibility: true, opacity: false, viewport: false, size: false}): boolean {
  if (!el.getClientRects().length) return false;
  if (options.viewport && !isInViewport(el)) return false;
  if (options.size && el.offsetHeight * el.offsetWidth === 0) return false;

  const {visibility, opacity} = options;
  if (!(visibility || opacity)) return true;
  const parentStyles = Object.assign({}, visibility && {visibility: 'hidden'}, opacity && {opacity: '0'}) as Partial<CSSStyleDeclaration>;
  return !findParentByStyles(el, parentStyles);
}

function isInViewport(el: HTMLElement): boolean {
  const elrect = el.getBoundingClientRect();
  if (!document.elementFromPoint(elrect.x, elrect.y)) return false;
  return !getListScrollParents(el).some((parent: HTMLElement) => !isIntersecting(elrect, parent.getBoundingClientRect()));
}

function isIntersecting(rect1: Rect | DOMRect, rect2: Rect | DOMRect): boolean {
  return (rect1.top <= rect2.bottom && rect1.top >= rect2.top || rect1.bottom <= rect2.bottom && rect1.bottom >= rect2.top) &&
         (rect1.left <= rect2.right && rect1.left >= rect2.left || rect1.right <= rect2.right && rect1.right >= rect2.left);
}
