import {Rect} from './rect';
import {getListScrollParents} from './scroll';
import {findClosestBy, findHost} from './traversing';
import {getWindowRect} from './window';

export interface VisibilityOptions {
  /** Element will be considered invisible if opacity set to '0' */
  opacity?: boolean;
  /** Element will be considered invisible if visibility set to 'hidden' */
  visibility?: boolean;
  /** Element will be considered invisible if it's not in viewport */
  viewport?: boolean;
}

/**
 * Checks if the specified element is visible
 * @param el - element to be checked
 * @param options - object of additional visibility options to include
 */
export function isVisible(el: HTMLElement, options: VisibilityOptions = {visibility: true}): boolean {
  if (!el.getClientRects().length) return false;
  if (options.visibility && findHost(el, (host) => getComputedStyle(host).visibility === 'hidden')) return false;
  if (options.opacity &&
    findClosestBy(el, (parent) => parent instanceof Element && getComputedStyle(parent).opacity === '0')) return false;
  return !(options.viewport && !isInViewport(el));
}

/**
 * Checks if the specified element is inside the viewport
 * @param el - element to be checked
 */
export function isInViewport(el: HTMLElement): boolean {
  const wndIntersection = Rect.intersect(getWindowRect(), Rect.from(el.getBoundingClientRect()));
  if (wndIntersection.area === 0) return false;
  return !getListScrollParents(el).some((parent: HTMLElement) =>
    Rect.intersect(wndIntersection, Rect.from(parent.getBoundingClientRect())).area === 0);
}
