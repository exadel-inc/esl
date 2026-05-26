import {getListScrollParents} from './parent';

/** Checks vertical scroll based on content height */
export function hasVerticalScroll(target: Element = document.documentElement): boolean {
  return target.scrollHeight > target.clientHeight;
}

/** Checks horizontal scroll based on content height */
export function hasHorizontalScroll(target: Element = document.documentElement): boolean {
  return target.scrollWidth > target.clientWidth;
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
