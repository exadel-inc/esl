import {createDeferred} from '../async/promise';
import {getListScrollParents} from '../dom/scroll';

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
  const style = window.getComputedStyle(element);
  if (!scrollablesArr || style.position === 'fixed') return Promise.reject();
  if (typeof options === 'boolean') {
    options = (options ? {block: 'start', inline: 'nearest'} : {block: 'end', inline: 'nearest'}) as ScrollIntoViewOptionsExtended;
  }
  const optionsObj: ScrollIntoViewOptionsExtended = options;
  const elementRect = getElementDefaultDimensions(element, options);

  const startTime = Date.now();

  const deferredArr = scrollablesArr.map((scrollable: Element) => {
    const deferred = createDeferred<void>();
    const newRect = calcNewRectangle(elementRect, scrollable, optionsObj);

    const scrollStartTop = elementRect.top + scrollable.scrollTop - newRect.top;
    const scrollTop = recalcWithoutOverflow(scrollStartTop, newRect.top, scrollable.scrollHeight, scrollable.clientHeight);
    const scrollStartLeft = elementRect.left + scrollable.scrollLeft - newRect.left;
    const scrollLeft = recalcWithoutOverflow(scrollStartLeft, newRect.left, scrollable.scrollWidth, scrollable.clientWidth);

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
      if (Math.abs(elementRect.top - elRect.top) >= 2 || Math.abs(elementRect.left - elRect.left) >= 2) {
        scrollIntoView(element, options);
      }
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

  const top = elrect.top - parseFloat(style.marginTop) - (options.offsetTop || 0);
  const left = elrect.left - parseFloat(style.marginLeft) - (options.offsetLeft || 0);

  return {top, left, width: element.clientWidth + marginWidth, height: element.clientHeight + marginHeight};
}

/** Corrects calculated scroll and element position if it goes outside of frame */
function recalcWithoutOverflow(scrollStart: number, elementStart: number, scrollLength: number, frameLength: number): OverflowParams {
  if (scrollStart > scrollLength - frameLength) {
    const overflow = scrollStart - (scrollLength - frameLength);
    elementStart += overflow;
    scrollStart -= overflow;
  }

  if (scrollStart < 0 && scrollStart < scrollLength - frameLength) {
    elementStart += scrollStart;
    scrollStart = 0;
  }

  return {elementStart, scrollStart};
}

/** Returns where element should be located on axis */
function calcOffset(obj: OffsetParams): number {
  const elementEnd = obj.start + obj.length;
  const frameEnd = obj.frameStart + obj.frameLength;
  if (obj.setting === 'center') return obj.frameLength / 2 - obj.length / 2;
  if (obj.setting === 'end') return obj.frameLength - obj.length;
  if (obj.setting === 'nearest') {
    if (obj.start >= obj.frameStart && elementEnd <= frameEnd ||
      obj.start <= obj.frameStart && elementEnd >= frameEnd) return obj.start - obj.frameStart;
    const middlePoint = (obj.start + elementEnd) / 2;
    const distanceStart = Math.abs(obj.frameStart - middlePoint);
    const distanceEnd = Math.abs(frameEnd - middlePoint);
    return distanceStart < distanceEnd ? calcOffset(Object.assign(obj, {setting: 'start'})) : calcOffset(Object.assign(obj, {setting: 'end'}));
  }
  return 0;
}

function ease(time: number): number {
  return (1 - Math.cos(Math.PI * time)) / 2;
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
