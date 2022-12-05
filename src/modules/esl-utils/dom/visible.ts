import {Rect} from './rect';
import {getListScrollParents} from './scroll';
import {getWindowRect} from './window';
import {findParentByStyles} from './traversing';

export interface VisibilityOptions {
  /** Element will be considered invisible if opacity set to '0' */
  opacity?: boolean;
  /** Element will be considered invisible if visibility set to 'hidden' */
  visibility?: boolean;
  /** Element will be considered invisible if it's not in viewport */
  viewport?: boolean;
}

/**
 * Check if specified element is visible
 * @param el - element to be checked
 * @param options - object of additional visibility options to include
 */
export function isVisible(el: HTMLElement, options: VisibilityOptions = {visibility: true}): boolean {
  if (!el.getClientRects().length) return false;
  if (options.viewport && !isInViewport(el)) return false;

  const {visibility, opacity} = options;
  if (!(visibility || opacity)) return true;
  const parentStyles = Object.assign({}, visibility && {visibility: 'hidden'}, opacity && {opacity: '0'}) as Partial<CSSStyleDeclaration>;
  return !findParentByStyles(el, parentStyles);
}

function isInViewport(el: HTMLElement): boolean {
  const wndIntersection = computeRectIntersection(getWindowRect(), el.getBoundingClientRect());
  if (wndIntersection.height  <= 0 || wndIntersection.width <= 0) return false;
  return !getListScrollParents(el).some((parent: HTMLElement) => {
    const parIntersection = computeRectIntersection(parent.getBoundingClientRect(), wndIntersection);
    return parIntersection.height <= 0 || parIntersection.width <= 0;
  });
}

function computeRectIntersection(rect1: DOMRect | Rect, rect2: DOMRect | Rect): Rect {
  const top = Math.max(rect1.top, rect2.top);
  const left = Math.max(rect1.left, rect2.left);
  const bottom = Math.min(rect1.bottom, rect2.bottom);
  const right = Math.min(rect1.right, rect2.right);
  const width = right - left;
  const height = bottom - top;
  return Rect.from({top, left, width, height});
}
