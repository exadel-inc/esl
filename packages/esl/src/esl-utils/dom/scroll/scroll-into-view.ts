import {tryUntil} from '../../async';

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
export function scrollIntoView(element: Element, options?: boolean | ScrollIntoViewOptions | undefined): Promise<boolean> {
  let same = 0;
  let lastLeft: number;
  let lastTop: number;
  const check = (): boolean => {
    const {top, left} = element.getBoundingClientRect();

    if (top !== lastTop || left !== lastLeft) {
      same = 0;
      lastTop = top;
      lastLeft = left;
    }
    return same++ > 2;
  };

  element.scrollIntoView(options);
  return tryUntil(check, 333, 30); // will check top position every 30ms, but not more than 250 times (10s)
}
