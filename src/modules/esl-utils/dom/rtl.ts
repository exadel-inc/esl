import {memoize} from '../decorators/memoize';

export type ScrollType = 'default' | 'negative' | 'reverse';

// TODO: functional
export abstract class RTLUtils {
  /** Check if the element in a RTL direction context */
  static isRtl(el: HTMLElement = document.body) {
    return getComputedStyle(el).direction === 'rtl';
  }

  /**
   * @returns RTL scroll type (lazy, memoized)
   */
  @memoize()
  static get scrollType(): ScrollType {
    let scrollType: ScrollType = 'default';
    const el = createDummyEl();
    document.body.appendChild(el);
    if (el.scrollLeft <= 0) {
      el.scrollLeft = 2;
      scrollType = el.scrollLeft < 2 ? 'negative' : 'reverse';
    }
    document.body.removeChild(el);
    return scrollType;
  }

  static normalizeScrollLeft(el: HTMLElement, value: number | null = null, isRtl: boolean = RTLUtils.isRtl(el)): number {
    value = (value === null) ? el.scrollLeft : value;
    switch (isRtl ? RTLUtils.scrollType : '') {
      case 'negative':
        return el.scrollWidth - el.clientWidth + value;
      case 'reverse':
        return el.scrollWidth - el.clientWidth - value;
      default:
        return value;
    }
  }
}

/** Creates the dummy test element with a horizontal scroll presented */
function createDummyEl() {
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
}
