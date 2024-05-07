import {getListScrollParents, getScrollParent} from './parent';

const $html = document.documentElement;

/** Checks if element is blocked from scrolling */
export function isScrollLocked(target: Element): boolean {
  return target.hasAttribute('esl-scroll-lock');
}

/** Checks vertical scroll based on content height */
export function hasVerticalScroll(target: Element = $html): boolean {
  return target.scrollHeight > target.clientHeight;
}

/** Checks horizontal scroll based on content height */
export function hasHorizontalScroll(target: Element = $html): boolean {
  return target.scrollWidth > target.clientWidth;
}

export type ScrollLockOptions = {
  /**
   * Option to lock scroll:
   * - 'none' | null | undefined - totally locks scroll with `overflow: hidden` option
   * - 'native' (applicable for page only) - left page scroll visible but inactive
   * - 'pseudo' (applicable for page only) - uses padding offset to make page static on lock
   * - 'background' (applicable for page only) - uses padding offset to make page static on lock and uses small pseudo-scrollbar z-index
   */
  strategy?: 'none' | 'native' | 'pseudo' | 'background' | null;
  /** Locks all scrollable parents */
  recursive?: boolean;
  /** Initiator (requester) object to limit lock operations by the query */
  initiator?: any;
};

// Scroll lock mutex holder
const initiatorMap = new WeakMap<Element, any[]>();
/** Occupy inner mutex of scroll lock */
const requestLock = (target: Element, initiator: any): void => {
  if (!initiator) return;
  const initiatorList = initiatorMap.get(target) || [];
  const index = initiatorList.indexOf(initiator);
  if (index === -1) initiatorList.push(initiator);
  initiatorMap.set(target, initiatorList);
};

/** Free inner mutex of the scroll lock */
const requestUnlock = (target: Element, initiator: any): boolean => {
  const initiatorList = initiatorMap.get(target) || [];
  const index = initiatorList.indexOf(initiator);
  if (index >= 0) initiatorList.splice(index, 1);
  if (!initiatorList.length || !initiator) initiatorMap.delete(target);
  return !initiatorMap.has(target);
};

/**
 * Disables a scroll on the element.
 * @param target - scrollable element which will be blocked from scrolling
 * @param options - additional options to lock scroll
 * */
export function lockScroll(target: Element = $html, options: ScrollLockOptions = {}): void {
  requestLock(target, options.initiator);
  const scrollable = target === $html ? target : getScrollParent(target);
  const hasVScroll = hasVerticalScroll(scrollable);
  if (scrollable === $html) {
    const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    $html.style.setProperty('--s-lock-offset', `${scrollWidth}px`);
  }
  scrollable.toggleAttribute('esl-scroll-lock-passive', !hasVScroll);
  scrollable.setAttribute('esl-scroll-lock', options.strategy || '');
  if (options.recursive && scrollable.parentElement) lockScroll(scrollable.parentElement, options);
}

/**
 * Enables a scroll on the target element in case it was requested with given initiator.
 * @param target - scrollable element
 * @param options - additional options to unlock scroll
 */
export function unlockScroll(target: Element = $html, options: ScrollLockOptions = {}): void {
  if (!requestUnlock(target, options.initiator)) return;
  const scrollable = target === $html ? target : getScrollParent(target);
  scrollable.removeAttribute('esl-scroll-lock-passive');
  scrollable.removeAttribute('esl-scroll-lock');
  if (options.recursive && scrollable.parentElement) unlockScroll(scrollable.parentElement, options);
}

export interface ElementScrollOffset {
  element: Element;
  top: number;
  left: number;
}

export function isOffsetChanged(offsets: ElementScrollOffset[]): boolean {
  return offsets.some((element) => element.element.scrollTop !== element.top || element.element.scrollLeft !== element.left);
}

export function getParentScrollOffsets($el: Element, $topContainer: Element): ElementScrollOffset[] {
  return getListScrollParents($el, $topContainer).map((el) => ({element: el, top: el.scrollTop, left: el.scrollLeft}));
}
