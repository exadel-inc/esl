/** Checks if the element in a RTL direction context */
export const isRTL = (el?: HTMLElement | null): boolean => getComputedStyle(el || document.body).direction === 'rtl';

export const normalizeScrollLeft = (el: HTMLElement, value: number | null = null, isRtl: boolean = isRTL(el)): number => {
  value = (value === null) ? el.scrollLeft : value;
  return isRtl ? el.scrollWidth - el.clientWidth + value : value;
};
