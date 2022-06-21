export type ScrollStrategy = 'none' | 'native' | 'pseudo';

const $html = document.documentElement;
const initiatorSet = new Set();
const targetMap = new Map();

// TODO: functional

export abstract class ScrollUtils {
  /** Check vertical scroll based on content height */
  static hasVerticalScroll(target = $html): boolean {
    return target.scrollHeight > target.clientHeight;
  }

  /**
   * Disable scroll on the page.
   * @param strategy - to make scroll visually disabled
   * */
  public static lock(strategy?: ScrollStrategy): void {
    const hasScroll = ScrollUtils.hasVerticalScroll();
    if (strategy && strategy !== 'none' && hasScroll) {
      $html.classList.add(`esl-${strategy}-scroll`);
    }
    $html.classList.add('esl-disable-scroll');
  }

  /**
   * Enable scroll on the page.
   * */
  public static unlock(): void {
    $html.classList.remove('esl-disable-scroll', 'esl-pseudo-scroll', 'esl-native-scroll');
  }

  /**
   * Disable scroll on the page.
   * @param initiator - object to associate request with
   * @param strategy - to make scroll visually disabled
   *
   * TODO: currently requests with different strategy is not taken into account
   * */
  public static requestLock(initiator: any, strategy?: ScrollStrategy): void {
    initiator && initiatorSet.add(initiator);
    (initiatorSet.size > 0) && ScrollUtils.lock(strategy);
  }

  /**
   * Enable scroll on the page in case it was requested with given initiator.
   * @param initiator - object to associate request with
   * @param strategy - to make scroll visually disabled
   */
  public static requestUnlock(initiator: any, strategy?: ScrollStrategy): void {
    initiator && initiatorSet.delete(initiator);
    (initiatorSet.size === 0) && ScrollUtils.unlock();
  }

  private static _onScrollElement(target: Element): any {
    const scrollTop = target.scrollTop;
    const scrollLeft = target.scrollLeft;
    return (e: KeyboardEvent) => {
      if (e.target === target) {
        target.scrollTop = scrollTop;
        target.scrollLeft = scrollLeft;
      }
    };
  }

  private static _onScrollWindow(): any {
    const scrollTop = window.scrollY || window.pageYOffset;
    const scrollLeft = window.scrollX || window.pageXOffset;
    return () => window.scrollTo(scrollLeft, scrollTop);
  }

  public static lockScrollTriggers(target: Element): boolean {
    if (this.isScrollLocked(target)) return true;
    target.setAttribute('esl-js-scroll-lock', '');
    const isTargetWindow = target.scrollHeight === target.clientHeight;
    const eventTarget = isTargetWindow ? window : target;
    const handler = isTargetWindow ? this._onScrollWindow() : this._onScrollElement(target);
    targetMap.set(target, handler);
    eventTarget.addEventListener('scroll', handler);
    return this.isScrollLocked(target);
  }

  public static unlockScrollTriggers(target: Element): boolean {
    if (!this.isScrollLocked(target)) return true;
    target.removeAttribute('esl-js-scroll-lock');
    target.removeEventListener('scroll', targetMap.get(target));
    targetMap.delete(target);
    return this.isScrollLocked(target);
  }

  public static isScrollLocked(target: Element): boolean {
    return target.hasAttribute('esl-js-scroll-lock') && targetMap.has(target);
  }
}
