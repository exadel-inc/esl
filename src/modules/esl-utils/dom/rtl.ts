/** RTL scroll browser behaviors */
export type ScrollType = 'negative';

/** Checks if the element in a RTL direction context */
export const isRTL = (el?: HTMLElement | null): boolean => getComputedStyle(el || document.body).direction === 'rtl';

export const testRTLScrollType = (): ScrollType => {
  return 'negative';
};

export const RTLScroll = {
  /** @returns RTL scroll type (lazy, memoized) */
  get type(): ScrollType {
    return 'negative';
  }
};

export const normalizeScrollLeft = (el: HTMLElement, value: number | null = null, isRtl: boolean = isRTL(el)): number => {
  value = (value === null) ? el.scrollLeft : value;
  return isRtl ? el.scrollWidth - el.clientWidth + value : value;
};
