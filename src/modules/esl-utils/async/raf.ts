import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Postpone action after next render
 */
export const afterNextRender = (callback: () => void): number => requestAnimationFrame(() => requestAnimationFrame(callback));

/**
 * Postpone action after a couple of renders
 */
export const skipOneRender = (callback: () => void): number => requestAnimationFrame(() => afterNextRender(callback));

/**
 * Decorate function to schedule execution after next render
 * @returns decorated function
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
