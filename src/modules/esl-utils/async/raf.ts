import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Postpone action after next render
 * @param {function} callback
 */
export const afterNextRender = (callback: () => void) => requestAnimationFrame(() => requestAnimationFrame(callback));

/**
 * Decorate function to schedule execution after next render
 * @param {function} fn
 * @returns {function} - decorated function
 */
export const rafDecorator = <T extends AnyToVoidFnSignature>(fn: T): T => {
  let lastArgs: any[] | null = null; // null if no calls requested
  return function (...args: any[]) {
    if (lastArgs === null) {
      requestAnimationFrame(() => {
        lastArgs && fn.call(this, ...lastArgs);
        lastArgs = null;
      });
    }
    lastArgs = args;
  } as T;
};
