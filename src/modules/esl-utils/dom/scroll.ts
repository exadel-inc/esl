import {createDeferred} from '../async/promise';
import {getNodeName, getParentNode} from './api';

export type ScrollStrategy = 'none' | 'native' | 'pseudo';

const $html = document.documentElement;
const initiatorSet = new Set();

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
}

/**
 * Get the list of all scroll parents, up the list of ancestors until we get to the top window object.
 * @param element - element for which you want to get the list of all scroll parents
 * @param list - array of elements to concatenate with the list of all scroll parents of element (optional)
 */
export function getListScrollParents(element: Node, list: Element[] = []): Element[] {
  const scrollParent = getScrollParent(element);
  const isBody = scrollParent === element.ownerDocument?.body;
  const target = isBody
    ? isScrollParent(scrollParent) ? scrollParent : []
    : scrollParent;

  const updatedList = list.concat(target);
  return isBody
    ? updatedList
    : updatedList.concat(getListScrollParents(getParentNode(scrollParent)));
}

/**
 * Get the scroll parent of the specified element in the DOM tree.
 * @param node - element for which to get the scroll parent
 */
export function getScrollParent(node: Node): Element {
  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument?.body as Element;
  }

  if (node instanceof HTMLElement && isScrollParent(node as Element)) {
    return node as Element;
  }

  return getScrollParent(getParentNode(node as Element));
}

/**
 * Check that element is scroll parent.
 * @param element - element for checking
 * */
export function isScrollParent(element: Element): boolean {
  // Firefox wants us to check `-x` and `-y` variations as well
  const {overflow, overflowX, overflowY} = getComputedStyle(element);
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}


interface ScrollIntoViewOptionsExtended extends ScrollIntoViewOptions {
  offsetTop?: number;
  offsetLeft?: number;
}

interface StepOptions {
  deferred: any;
  behavior: string;
  el: Element;
  top: number;
  left: number;
  startTime: number;
  startTop: number;
  startLeft: number;
}

interface OffsetParams {
  setting: string;
  start: number;
  length: number;
  frameStart: number;
  frameLength: number;
}

interface OverflowParams {
  scrollStart: number;
  elementStart: number;
}

interface OverflowRecalcParams extends OverflowParams {
  scrollLength: number;
  frameLength: number;
}

interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * This is a promise-based version of scrollIntoView().
 * Method scrolls the element's parent container such that the element on which
 * scrollIntoView() is called is visible to the user. The promise is resolved when
 * the element became visible to the user and scrolling stops.
 *
 * Note: Please, use the native element.scrollIntoView() if you don't need a promise
 * to detect the moment when the scroll is finished or you don't use smooth behavior.
 * @param element - element to be made visible to the user
 * @param options - scrollIntoView options
 */

export function scrollIntoView(element: Element, options: boolean | ScrollIntoViewOptionsExtended = {block: 'start', inline: 'nearest'}): Promise<any> {
  const scrollablesArr = getListScrollParents(element);
  if (!scrollablesArr) return Promise.reject();
  if (typeof options === 'boolean') {
    options = (options ? {block: 'start', inline: 'nearest'} : {block: 'end', inline: 'nearest'}) as ScrollIntoViewOptionsExtended;
  }
  const optionsObj: ScrollIntoViewOptionsExtended = options;
  const elementRect = getElementDefaultDimensions(element, options);

  const startTime = Date.now();

  const deferredArr = scrollablesArr.map((scrollable: Element) => {
    const deferred = createDeferred<void>();
    const newRect = calcNewRectangle(elementRect, scrollable, optionsObj);

    const scrollTop = recalcWithoutOverflow({
      scrollStart: elementRect.top + scrollable.scrollTop - newRect.top,
      elementStart: newRect.top,
      scrollLength: scrollable.scrollHeight,
      frameLength: scrollable.clientHeight});

    const scrollLeft = recalcWithoutOverflow({
      scrollStart: elementRect.left + scrollable.scrollLeft - newRect.left,
      elementStart: newRect.left,
      scrollLength: scrollable.scrollWidth,
      frameLength: scrollable.clientWidth});

    step({
      deferred,
      behavior: optionsObj.behavior || 'auto',
      el: scrollable,
      top: scrollTop.scrollStart,
      left: scrollLeft.scrollStart,
      startTime,
      startTop: scrollable.scrollTop,
      startLeft: scrollable.scrollLeft
    });

    Object.assign(elementRect, {top: scrollTop.elementStart, left: scrollLeft.elementStart});

    return deferred.promise;
  }, []);

  return Promise.all(deferredArr)
    .then(() => {
      const elRect = getElementDefaultDimensions(element, optionsObj);
      if (Math.abs(elementRect.top - elRect.top) >= 2 && Math.abs(elementRect.left - elRect.left) >= 2) throw false;
    });
}

/** Calculates element rectangle according to passed options */
function calcNewRectangle(elRect: Rectangle, scrollable: Element, options: ScrollIntoViewOptionsExtended): Rectangle {
  const frame = scrollable.getBoundingClientRect();
  const left = frame.left + calcOffset({
    setting: options.inline!,
    start: elRect.left,
    length: elRect.width,
    frameStart: frame.left,
    frameLength: scrollable.clientWidth});

  const top = frame.top + calcOffset({
    setting: options.block!,
    start: elRect.top,
    length: elRect.height,
    frameStart: frame.top,
    frameLength: scrollable.clientHeight});

  return {left, top, width: elRect.width, height: elRect.height};
}

/** Returns element rectangle with margins */
function getElementDefaultDimensions(element: Element, options: ScrollIntoViewOptionsExtended): Rectangle {
  const elrect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  const marginWidth = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  const marginHeight = parseFloat(style.marginTop) + parseFloat(style.marginBottom);

  const top = elrect.top - parseFloat(style.marginTop) + (options.offsetTop || 0);
  const left = elrect.left - parseFloat(style.marginLeft) + (options.offsetLeft || 0);

  return {top, left, width: element.clientWidth + marginWidth, height: element.clientHeight + marginHeight};
}

/** Corrects calculated scroll and element position if it goes outside of frame */
function recalcWithoutOverflow(obj: OverflowRecalcParams): OverflowParams {
  if (obj.scrollStart > obj.scrollLength - obj.frameLength) {
    const overflow = obj.scrollStart - (obj.scrollLength - obj.frameLength);
    obj.elementStart += overflow;
    obj.scrollStart -= overflow;
  }

  if (obj.scrollStart < 0 && obj.scrollStart < obj.scrollLength - obj.frameLength) {
    obj.elementStart += obj.scrollStart;
    obj.scrollStart = 0;
  }

  return {elementStart: obj.elementStart, scrollStart: obj.scrollStart};
}

/** Returns where element should be located on axis */
function calcOffset(obj: OffsetParams): number {
  const elementEnd = obj.start + obj.length;
  const frameEnd = obj.frameStart + obj.frameLength;
  if (obj.setting === 'center') return obj.frameLength / 2 - obj.length / 2;
  if (obj.setting === 'end') return obj.frameLength - obj.length;
  if (obj.setting === 'nearest') {
    if (obj.start >= obj.frameStart && elementEnd <= frameEnd) return obj.start - obj.frameStart;
    const middlePoint = (obj.start + elementEnd) / 2;
    const distanceStart = Math.abs(obj.frameStart - middlePoint);
    const distanceEnd = Math.abs(frameEnd - middlePoint);
    return distanceStart < distanceEnd ? calcOffset(Object.assign(obj, {setting: 'start'})) : calcOffset(Object.assign(obj, {setting: 'end'}));
  }
  return 0;
}

function ease(time: number): number {
  return 0.5 * (1 - Math.cos(Math.PI * time));
}

/** Looping function that scrolls element to passed context position */
function step(context: StepOptions): Promise<any> | number {
  const time = Date.now();
  const duration = context.behavior === 'smooth' ? 1000 : 0;
  let elapsed = (time - context.startTime) / duration;
  elapsed = elapsed > 1 ? 1 : elapsed;
  const value = ease(elapsed);

  const currentLeft = context.startLeft + (context.left - context.startLeft) * (value);
  const currentTop = context.startTop + (context.top - context.startTop) * (value);
  context.el.scrollLeft = currentLeft;
  context.el.scrollTop = currentTop;

  if (currentLeft !== context.left || currentTop !== context.top) {
    return window.requestAnimationFrame(() => step(context));
  }
  return context.deferred.resolve(true);
}
