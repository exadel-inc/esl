import {createDeferred} from '../../async/promise';
import {getListScrollParents} from './misc';

interface ScrollIntoViewOptionsExtended extends ScrollIntoViewOptions {
  scrollDuration?: number;
  scrollRepeatDuration?: number;
  offsetTop?: number;
  offsetLeft?: number;
}

interface StepOptions {
  deferred: any;
  scrollDuration: number;
  el: Element | Window;
  top: number;
  left: number;
  startTime: number;
  startTop: number;
  startLeft: number;
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

export function scrollIntoView(element: Element, options?: boolean | ScrollIntoViewOptionsExtended): Promise<any> {
  const scrollablesList = getListScrollParents(element);
  const style = window.getComputedStyle(element);
  const currentPositionY = window.scrollY || window.pageYOffset;
  const currentPositionX = window.scrollX || window.pageXOffset;

  if (!scrollablesList || style.position === 'fixed') return Promise.reject();
  const optionsObj = normalizeOptions(options);
  const elementRect = getElementRect(element, optionsObj);

  const startTime = Date.now();

  const deferredArr = scrollablesList.map((scrollable: Element) =>
    scrollScrollable(scrollable, optionsObj, elementRect, currentPositionX, currentPositionY, startTime)
  , []);

  return Promise.all(deferredArr)
    .then(() => {
      const elapsed = Date.now() - startTime;
      const scrollRepeatDuration = optionsObj.scrollRepeatDuration;
      if (elapsed > scrollRepeatDuration!) return;
      const newElementRect = getElementRect(element, optionsObj);
      const newPositionY = window.scrollY || window.pageYOffset;
      const newPositionX = window.scrollX || window.pageXOffset;

      const positionMatchesByY = Math.abs(elementRect.top - newElementRect.top - (newPositionY - currentPositionY)) <= 2;
      const positionMatchesByX = Math.abs(elementRect.left - newElementRect.left - (newPositionX - currentPositionX)) <= 2;
      if (!positionMatchesByY || !positionMatchesByX) {
        return scrollIntoView(element, Object.assign(options, {scrollRepeatDuration: scrollRepeatDuration! - elapsed}));
      }
    });
}

function scrollScrollable(
    scrollable: Element,
    options: ScrollIntoViewOptionsExtended,
    elementRect: Rectangle,
    currentPosX: number,
    currentPosY: number,
    startTime: number): Promise<void> {
  const deferred = createDeferred<void>();
  const isPageScrollable = scrollable.scrollHeight === scrollable.clientHeight;

  const scrollDuration = options.behavior === 'auto' ? 0 : options.scrollDuration!;
  if (isPageScrollable) {
    step({
      deferred,
      scrollDuration,
      el: window,
      top: elementRect.top + currentPosY,
      left: elementRect.left + currentPosX,
      startTime,
      startTop: scrollable.scrollTop + currentPosY,
      startLeft: scrollable.scrollLeft + currentPosX
    });
  }

  const newRect = calcNewRectangle(elementRect, scrollable, options);
  const scrollStartTop = elementRect.top + scrollable.scrollTop - newRect.top;
  const scrollTop = recalcWithoutOverflow(scrollStartTop, newRect.top, scrollable.scrollHeight, scrollable.clientHeight);
  const scrollStartLeft = elementRect.left + scrollable.scrollLeft - newRect.left;
  const scrollLeft = recalcWithoutOverflow(scrollStartLeft, newRect.left, scrollable.scrollWidth, scrollable.clientWidth);

  step({
    deferred,
    scrollDuration,
    el: scrollable,
    top: scrollTop.scrollStart,
    left: scrollLeft.scrollStart,
    startTime,
    startTop: scrollable.scrollTop,
    startLeft: scrollable.scrollLeft
  });
  Object.assign(elementRect, {top: scrollTop.elementStart, left: scrollLeft.elementStart});

  return deferred.promise;
}

function normalizeOptions(options: ScrollIntoViewOptionsExtended | boolean = {block: 'start', inline: 'nearest'}): ScrollIntoViewOptionsExtended {
  if (typeof options === 'boolean') {
    options = (options ? {block: 'start', inline: 'nearest'} : {block: 'end', inline: 'nearest'});
  }

  return Object.assign({}, {
    inline: options.inline || 'nearest',
    block: options.block || 'start',
    behavior: options.behavior || 'auto',
    scrollDuration: options.scrollDuration || 900,
    scrollRepeatDuration: options.scrollRepeatDuration || 5000,
    offsetLeft: options.offsetLeft || 0,
    offsetTop: options.offsetTop || 0
  });
}

/** Calculates element rectangle according to passed options */
function calcNewRectangle(elRect: Rectangle, scrollable: Element, options: ScrollIntoViewOptionsExtended): Rectangle {
  const frame = scrollable.getBoundingClientRect();
  const left = frame.left + calcOffset(options.inline!, elRect.left, elRect.width, frame.left, scrollable.clientWidth);
  const top = frame.top + calcOffset(options.block!, elRect.top, elRect.height, frame.top, scrollable.clientHeight);

  return {left, top, width: elRect.width, height: elRect.height};
}

/** Returns element rectangle with margins */
function getElementRect(element: Element, options: ScrollIntoViewOptionsExtended): Rectangle {
  const elrect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  const marginWidth = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
  const marginHeight = parseFloat(style.marginTop) + parseFloat(style.marginBottom);

  const top = elrect.top - parseFloat(style.marginTop) - options.offsetTop!;
  const left = elrect.left - parseFloat(style.marginLeft) - options.offsetLeft!;

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
function calcOffset(setting: ScrollLogicalPosition, start: number, length: number, frameStart: number, frameLength: number): number {
  const elementEnd = start + length;
  const frameEnd = frameStart + frameLength;
  if (setting === 'center') return frameLength / 2 - length / 2;
  if (setting === 'end') return frameLength - length;
  if (setting === 'nearest') {
    if (start >= frameStart && elementEnd <= frameEnd ||
        start <= frameStart && elementEnd >= frameEnd) return start - frameStart;
    const middlePoint = (start + elementEnd) / 2;
    const distanceStart = Math.abs(frameStart - middlePoint);
    const distanceEnd = Math.abs(frameEnd - middlePoint);
    const newSetting = distanceStart < distanceEnd ? 'start' : 'end';
    return calcOffset(newSetting, start, length, frameStart, frameLength);
  }
  return 0;
}

function ease(time: number): number {
  return (1 - Math.cos(Math.PI * time)) / 2;
}

/** Looping function that scrolls element to passed context position */
function step(context: StepOptions): Promise<any> | number {
  const time = Date.now();
  const {startLeft, startTop, left, top} = context;
  let elapsed = (time - context.startTime) / context.scrollDuration;
  elapsed = elapsed > 1 ? 1 : elapsed;
  const value = ease(elapsed);

  const currentLeft = startLeft + (left - startLeft) * value;
  const currentTop = startTop + (top - startTop) * value;
  context.el.scrollTo(currentLeft, currentTop);

  if (currentLeft !== left || currentTop !== top) {
    return window.requestAnimationFrame(() => step(context));
  }
  return context.deferred.resolve(true);
}
