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

/**
 * Disable scroll on the page.
 * @param strategy - to make scroll visually disabled
 * */
function lockScroll(strategy?: ScrollStrategy): void {
  const hasScroll = ScrollUtils.hasVerticalScroll();
  if (strategy && strategy !== 'none' && hasScroll) {
    $html.classList.add(`esl-${strategy}-scroll`);
  }
  $html.classList.add('esl-disable-scroll');
}

/**
 * Enable scroll on the page.
 * */
function unlockScroll(): void {
  $html.classList.remove('esl-disable-scroll', 'esl-pseudo-scroll', 'esl-native-scroll');
}

/**
 * Disable scroll on the page.
 * @param initiator - object to associate request with
 * @param strategy - to make scroll visually disabled
 *
 * TODO: currently requests with different strategy is not taken into account
 * */
function requestLockScroll(initiator: any, strategy?: ScrollStrategy): void {
  initiator && initiatorSet.add(initiator);
  (initiatorSet.size > 0) && lockScroll(strategy);
}

/**
 * Enable scroll on the page in case it was requested with given initiator.
 * @param initiator - object to associate request with
 * @param strategy - to make scroll visually disabled
 */
function requestUnlockScroll(initiator: any, strategy?: ScrollStrategy): void {
  initiator && initiatorSet.delete(initiator);
  (initiatorSet.size === 0) && unlockScroll();
}

/** @deprecated use functional utils instead */
export abstract class ScrollUtils {

  public static readonly hasVerticalScroll = hasVerticalScroll;
  public static readonly hasHorizontalScroll = hasHorizontalScroll;

  public static readonly lock = lockScroll;
  public static readonly unlock = unlockScroll;
  public static readonly requestLock = requestLockScroll;
  public static readonly requestUnlock = requestUnlockScroll;

}
