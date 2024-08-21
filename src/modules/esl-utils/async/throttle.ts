import {createDeferred} from './promise/defered';

import type {AnyToAnyFnSignature} from '../misc/functions';
import type {Deferred} from './promise/defered';

/** Throttled<F> is a function wrapper type for a function decorated via throttle */
export interface Throttled<F extends AnyToAnyFnSignature> {
  /** Throttled method signature */
  (...args: Parameters<F>): void;
  /** Promise of throttled function call */
  promise: Promise<ReturnType<F> | void>;
}

/**
 * Creates a throttled executed function.
 * The func is invoked with the last arguments provided to the throttled function.
 * @param fn - function to decorate
 * @param threshold - indicates how often function could be called
 * @param thisArg - optional context to call original function, use debounced method call context if not defined
 */
// TODO change after migration  eslint-disable-next-line @typescript-eslint/ban-types
export function throttle<F extends AnyToAnyFnSignature>(fn: F, threshold = 250, thisArg?: object): Throttled<F> {
  let last: number;
  let timeout: number | null = null;
  let deferred: Deferred<ReturnType<F>> | null = null;

  function throttledSubject(...args: any[]): void {
    const now = Date.now();

    deferred = deferred || createDeferred();

    (typeof timeout === 'number') && clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      last = Date.now();
      timeout = null;
      deferred!.resolve(fn.apply(thisArg || this, args));
      deferred = null;
    }, Math.max(last + threshold - now, 0));
  }
  Object.defineProperty(throttledSubject, 'promise', {
    get: () => (deferred = deferred || createDeferred()).promise
  });
  return throttledSubject as Throttled<F>;
}
