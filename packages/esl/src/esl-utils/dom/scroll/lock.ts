import {injectStyles} from '../styles';
import {getScrollParent} from './parent';
import {hasVerticalScroll} from './utils';

const STYLES = `
  [esl-scroll-lock] {
    overflow: hidden !important;
  }
  [esl-scroll-lock]:not(html[esl-scroll-lock='native'])::-webkit-scrollbar {
    display: none !important;
  }
  html[esl-scroll-lock] body {
    overflow: hidden !important;
  }
  html[esl-scroll-lock='native'] {
    overflow-y: scroll !important;
  }
  html[esl-scroll-lock='native'][esl-scroll-lock-passive] {
    overflow-y: hidden !important;
  }
  html[esl-scroll-lock='native'] body {
    max-width: 100vw !important;
    max-height: 100vh !important;
  }
  html[esl-scroll-lock='pseudo'],
  html[esl-scroll-lock='background'] {
    --s-lock-offset: 0;
    padding-right: var(--s-lock-offset);
  }
  html[esl-scroll-lock='pseudo']:not([esl-scroll-lock-passive])::after,
  html[esl-scroll-lock='background']:not([esl-scroll-lock-passive])::after {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    z-index: 1;
  }
  html[esl-scroll-lock='pseudo']:not([esl-scroll-lock-passive])::after {
    z-index: 999999;
  }
`;

const $html = document.documentElement;

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

/** Checks if element is blocked from scrolling */
export function isScrollLocked(target: Element): boolean {
  return target.hasAttribute('esl-scroll-lock');
}

/**
 * Disables a scroll on the element.
 * @param target - scrollable element which will be blocked from scrolling
 * @param options - additional options to lock scroll
 * */
export function lockScroll(target: Element = $html, options: ScrollLockOptions = {}): void {
  injectStyles(STYLES, 'esl-scroll-lock-styles');
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
