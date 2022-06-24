export type ScrollStrategy = 'none' | 'native' | 'pseudo';

const $html = document.documentElement;
const initiatorSet = new Set();


/** Check vertical scroll based on content height */
export function hasVerticalScroll(target = $html): boolean {
  return target.scrollHeight > target.clientHeight;
}

/** Check horizontal scroll based on content height */
export function hasHorizontalScroll(target = $html): boolean {
  return target.scrollWidth > target.clientWidth;
}

function lockPageScroll(strategy?: ScrollStrategy | null) {
  const hasScroll = hasVerticalScroll();
  if (strategy && strategy !== 'none' && hasScroll) {
    $html.classList.add(`esl-${strategy}-scroll`);
  }
  $html.classList.add('esl-disable-scroll');
}

/**
 * Disable scroll on the page.
 * @param strategy - to make scroll visually disabled
 * @param initiator - object to associate request with
 *
 * TODO: currently requests with different strategy is not taken into account
 * */
export function lockScroll(strategy?: ScrollStrategy | null, initiator?: any): void {
  if (initiator) {
    initiatorSet.add(initiator);
    if (initiatorSet.size === 0) return;
  }
  lockPageScroll(strategy);
}

/**
 * Enable scroll on the page in case it was requested with given initiator.
 * @param initiator - object to associate request with
 */
export function unlockScroll(initiator?: any): void {
  if (initiator) {
    initiatorSet.delete(initiator);
    if (initiatorSet.size > 0) return;
  }

  $html.classList.remove('esl-disable-scroll', 'esl-pseudo-scroll', 'esl-native-scroll');
}

/** @deprecated use functional utils instead */
export abstract class ScrollUtils {
  public static readonly hasVerticalScroll = hasVerticalScroll;
  public static readonly hasHorizontalScroll = hasHorizontalScroll;

  public static readonly lock = lockScroll;
  public static readonly unlock = unlockScroll;
  public static readonly requestLock = (initiator: any, strategy?: ScrollStrategy | null) => lockScroll(strategy, initiator);
  public static readonly requestUnlock = (initiator: any) => unlockScroll(initiator);
}
