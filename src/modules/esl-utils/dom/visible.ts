import {Rect} from './rect';
import {isElement} from './api';
import {getViewportRect} from './window';
import {getListScrollParents} from './scroll';
import {findClosestBy, findHost} from './traversing';

export interface VisibilityOptions {
  /** Element will be considered invisible if opacity set to '0' */
  opacity?: boolean;
  /** Element will be considered invisible if visibility set to 'hidden' */
  visibility?: boolean;
  /** Element will be considered invisible if it's not in viewport */
  viewport?: boolean;
}

/** @returns if the exact passed Element hidden with CSS visibility */
const isHiddenPredicate = (el: Element): boolean => isElement(el) && getComputedStyle(el).visibility === 'hidden';

/** @returns if the exact passed Element is transparent (CSS opacity is 0) */
const isTransparentPredicate = (el: Element): boolean => isElement(el) && getComputedStyle(el).opacity === '0';

/**
 * Checks if the specified element is visible
 * @param el - element to be checked
 * @param options - object of additional visibility options to include
 */
export function isVisible(el: Element, options: VisibilityOptions = {visibility: true}): boolean {
  if (!el.getClientRects().length) return false;
  if (options.visibility && findHost(el, isHiddenPredicate)) return false;
  if (options.opacity && findClosestBy(el, isTransparentPredicate)) return false;
  return !(options.viewport && !isInViewport(el));
}

/**
 * Checks if the specified element is inside the viewport
 * @param el - element to be checked
 */
export function isInViewport(el: Element): boolean {
  const wndIntersection = Rect.from(el).intersect(getViewportRect());
  if (wndIntersection.area === 0) return false;
  return !getListScrollParents(el).some(
    (parent: Element) => Rect.from(parent).intersect(wndIntersection).area === 0
  );
}
