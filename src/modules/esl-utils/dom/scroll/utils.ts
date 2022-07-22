import {getScrollParent} from './parent';

const $html = document.documentElement;

const initiatorMap = new WeakMap<Element, any[]>();

/** Checks if element is blocked from scrolling */
export function isScrollLocked(target: Element): boolean {
  return target.hasAttribute('esl-scroll-lock');
}

/** Checks vertical scroll based on content height */
export function hasVerticalScroll(target = $html): boolean {
  return target.scrollHeight > target.clientHeight;
}

/** Checks  horizontal scroll based on content height */
export function hasHorizontalScroll(target = $html): boolean {
  return target.scrollWidth > target.clientWidth;
}

export type ScrollLockOptions = {
  /**
   * Option to lock scroll:
   * - 'none' | null | undefined - totally locks scroll with `overflow: hidden` option
   * - 'native' (applicable for page only) - left page scroll visible but inactive
   * - 'pseudo' (applicable for page only) - uses special flexbox hack on the page,
   * to make page static on lock but with capability to overlap the scroll
   */
  strategy?: 'none' | 'native' | 'pseudo' | null;
  /** Locks all scrollable parents */
  recursive?: boolean;
  /** Initiator (requester) object to limit lock operations by the query */
  initiator?: any;
};

/**
 * Disables scroll on the element.
 * @param target - scrollable element which will be blocked from scrolling
 * @param options - additional options to lock scroll
 * */
export function lockScroll(target: Element = $html, options: ScrollLockOptions = {}): void {
  const {initiator} = options;
  if (initiator) {
    const initiatorList = initiatorMap.get(target);
    if (initiatorList) {
      if (initiatorList.includes(initiator)) return;
      initiatorList.push(initiator);
      if (initiatorList.length > 1) return;
    } else {
      initiatorMap.set(target, [initiator]);
    }
  }

  const scrollable = target === $html ? target : getScrollParent(target);
  scrollable.setAttribute('esl-scroll-lock', options.strategy || '');
  if (options.recursive && scrollable.parentElement) lockScroll(scrollable.parentElement, options);
}

/**
 * Enables scroll on the target element in case it was requested with given initiator.
 * @param target - scrollable element
 * @param options - additional options to unlock scroll
 */
export function unlockScroll(target: Element = $html, options: ScrollLockOptions = {}): void {
  const {initiator} = options;
  if (initiator) {
    const initiatorList = initiatorMap.get(target);
    if (!initiatorList) return;
    const index = initiatorList.indexOf(initiator);
    if (index >= 0) initiatorList.splice(index, 1);
    if (initiatorList.length > 0) return;
  } else {
    initiatorMap.delete(target);
  }

  const scrollable = target === $html ? target : getScrollParent(target);
  scrollable.removeAttribute('esl-scroll-lock');
  if (options.recursive && scrollable.parentElement) unlockScroll(scrollable.parentElement, options);
}
