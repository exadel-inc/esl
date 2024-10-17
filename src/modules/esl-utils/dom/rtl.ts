// TODO: Revisit using https://caniuse.com/mdn-api_element_scrollleft in 5.0.0
/** RTL scroll browser behaviours */
export type ScrollType = 'default' | 'negative' | 'reverse';

/** Checks if the element in a RTL direction context */
export const isRTL = (el?: HTMLElement | null): boolean => getComputedStyle(el || document.body).direction === 'rtl';

/** Creates the dummy test element with a horizontal scroll presented */
const createDummyScroll = (): HTMLElement => {
  const el = document.createElement('div');
  el.appendChild(document.createTextNode('ESL!'));
  el.dir = 'rtl';
  Object.assign(el.style, {
    position: 'absolute',
    top: '-1000px',
    width: '4px',
    height: '1px',
    fontSize: '14px',
    overflow: 'scroll'
  });
  return el;
};

export const testRTLScrollType = (): ScrollType => {
  let scrollType: ScrollType = 'default';
  const el = createDummyScroll();
  document.body.appendChild(el);
  if (el.scrollLeft <= 0) {
    el.scrollLeft = 2;
    scrollType = el.scrollLeft < 2 ? 'negative' : 'reverse';
  }
  document.body.removeChild(el);
  return scrollType;
};

let type: ScrollType | null = null;

export const RTLScroll = {
  /** @returns RTL scroll type (lazy, memoized) */
  get type(): ScrollType {
    if (typeof type === 'string') return type;
    return type = testRTLScrollType();
  }
};

export const normalizeScrollLeft = (el: HTMLElement, value: number | null = null, isRtl: boolean = isRTL(el)): number => {
  value = (value === null) ? el.scrollLeft : value;
  switch (isRtl ? RTLScroll.type : '') {
    case 'negative':
      return el.scrollWidth - el.clientWidth + value;
    case 'reverse':
      return el.scrollWidth - el.clientWidth - value;
    default:
      return value;
  }
};
