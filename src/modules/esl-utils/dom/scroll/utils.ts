export type ScrollStrategy = 'none' | 'native' | 'pseudo';

const $html = document.documentElement;
const initiatorSet = new Set();

/** Check if elment is blocked from scrolling */
export function isScrollLocked(target: Element): boolean {
  return target.hasAttribute('esl-scroll-lock');
}

/** Check vertical scroll based on content height */
export function hasVerticalScroll(target = $html): boolean {
  return target.scrollHeight > target.clientHeight;
}

/** Check horizontal scroll based on content height */
export function hasHorizontalScroll(target = $html): boolean {
  return target.scrollWidth > target.clientWidth;
}

/**
 * Disable scroll on the element.
 * @param target - scrollable element which will be blocked from scrolling
 * @param strategy - to make scroll visually disabled
 * @param initiator - object to associate request with
 *
 * TODO: currently requests with different strategy are not taken into account
 * */
export function lockScroll(target: Element = document.documentElement, options?: {strategy?: ScrollStrategy | null, initiator?: any}): void {
  if (isScrollLocked(target)) return;
  if (options?.initiator) {
    initiatorSet.add(options.initiator);
    if (initiatorSet.size === 0) return;
  }
  toggleBodyScrollLock(target, true);
  target.setAttribute('esl-scroll-lock', '');
}

/**
 * Enable scroll on the target element in case it was requested with given initiator.
 * @param target - scrollable element
 * @param initiator - object to associate request with
 */
export function unlockScroll(target: Element = document.documentElement, initiator?: any): void {
  if (!isScrollLocked(target)) return;
  if (initiator) {
    initiatorSet.delete(initiator);
    if (initiatorSet.size > 0) return;
  }
  toggleBodyScrollLock(target, false);
  target.removeAttribute('esl-scroll-lock');
}

/** Toggles scroll on document if target element has same dimensions as document */
function toggleBodyScrollLock(target: Element, toggle: boolean): void {
  if (target !== document.documentElement && (target.scrollHeight === target.clientHeight || target.scrollWidth === target.clientWidth)) {
    document.documentElement.toggleAttribute('esl-scroll-lock', toggle);
  }
}
