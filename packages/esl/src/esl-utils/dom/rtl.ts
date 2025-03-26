const DEFAULT_SCROLL_TYPE = 'negative';

/** @deprecated RTL scroll browser behaviors now always returns `negative` value */
export type ScrollType = typeof DEFAULT_SCROLL_TYPE;

/** Checks if the element in a RTL direction context */
export const isRTL = (el?: HTMLElement | null): boolean => getComputedStyle(el || document.body).direction === 'rtl';

/** @deprecated scroll type is now consistent and always returns a `negative` value */
export const testRTLScrollType = (): ScrollType => {
  return DEFAULT_SCROLL_TYPE;
};

/** @deprecated scroll type is now consistent and always returns a `negative` value */
export const RTLScroll = {
  /** @returns RTL scroll type (lazy, memoized) */
  get type(): ScrollType {
    return DEFAULT_SCROLL_TYPE;
  }
};

export const normalizeScrollLeft = (el: HTMLElement, value: number | null = null, isRtl: boolean = isRTL(el)): number => {
  value = (value === null) ? el.scrollLeft : value;
  return isRtl ? el.scrollWidth - el.clientWidth + value : value;
};
