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
  const wndIntersection = Rect.intersect(getWindowRect(), Rect.from(el.getBoundingClientRect()));
  if (wndIntersection.isEmpty()) return false;
  return !getListScrollParents(el).some((parent: HTMLElement) =>
    Rect.intersect(wndIntersection, Rect.from(parent.getBoundingClientRect())).isEmpty());
}
