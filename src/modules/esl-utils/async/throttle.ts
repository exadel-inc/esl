import {PromiseUtils} from './promise';

import type {AnyToAnyFnSignature} from '../misc/functions';
import type {Deferred, PromisifyResultFn} from './promise';

/** Throttled<F> is a function wrapper type for a function decorated via throttle */
export interface Throttled<F extends AnyToAnyFnSignature> extends PromisifyResultFn<F> {
  /** {Promise} of throttled function call */
  promise: Promise<ReturnType<F> | void>;
}

/**
 * Creates a throttled executed function.
 * The func is invoked with the last arguments provided to the throttled function.
 * @param fn
 * @param threshold - indicates how often function could be called
 * @returns {Function}
 */
export function throttle<F extends AnyToAnyFnSignature>(fn: F, threshold = 250): Throttled<F> {
  let last: number;
  let timeout: number | null = null;
  let deferred: Deferred<ReturnType<F>> | null = null;

  function throttledSubject(...args: any[]) {
    const now = Date.now();

    if (!last || now >= last + threshold) {
      last = now;
      return Promise.resolve(fn.apply(this, args));
    }

    deferred = deferred || PromiseUtils.deferred();
    (typeof timeout === 'number') && clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      last = now;
      timeout = null;
      // fn.apply to save call context
      deferred!.resolve(fn.apply(this, args));
      deferred = null;
    }, threshold);
    return deferred.promise;
  }
  Object.defineProperty(throttledSubject, 'promise', {
    get: () => deferred ? deferred.promise : Promise.resolve()
  });
  return throttledSubject as Throttled<F>;
}
