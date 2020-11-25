import type {AnyToAnyFnSignature} from '../misc/functions';
import {Deferred, PromiseUtils} from './promise';

type PromisifiedFn<F extends AnyToAnyFnSignature> = ((...args: Parameters<F>) => Promise<ReturnType<F> | void>);
/** Debounced<F> is a function wrapper type for a function decorated via debounce */
export interface Debounced<F extends AnyToAnyFnSignature> extends PromisifiedFn<F> {
  /** {Promise} that represents */
  promise: Promise<ReturnType<F> | void>;
}

/**
 * Creates a debounced function that implements {@link Debounced}.
 * Debounced function delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn
 * @param [wait]
 * @returns {Function}
 */
export function debounce<F extends AnyToAnyFnSignature>(fn: F, wait = 10): Debounced<F> {
  let timeout: number | null = null;
  let deferred: Deferred<ReturnType<F>> | null = null;

  function debouncedSubject(...args: any[]) {
    deferred = deferred || PromiseUtils.deferred();
    (typeof timeout === 'number') && clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      timeout = null;
      deferred!.resolve(fn(...args));
      deferred = null;
    }, wait);
    return deferred.promise;
  }
  Object.defineProperty(debouncedSubject, 'promise', {
    get: () => deferred ? deferred.promise : Promise.resolve()
  });

  return debouncedSubject as Debounced<F>;
}
