import {createDeferred} from './promise';

import type {AnyToAnyFnSignature} from '../misc/functions';
import type {Deferred} from './promise';

/** Debounced<F> is a function wrapper type for a function decorated via debounce */
export interface Debounced<F extends AnyToAnyFnSignature> {
  /** Debounced method signature */
  (...args: Parameters<F>): void;
  /** Promise of deferred function call */
  promise: Promise<ReturnType<F> | void>;
  /** Cancel debounced call */
  cancel(): void;
}

/**
 * Creates a debounced function that implements {@link Debounced}.
 * Debounced function delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 * The func is invoked with the last arguments provided to the debounced function.
 * @param fn - function to decorate
 * @param wait - time to debounce
 * @param thisArg - optional context to call original function, use debounced method call context if not defined
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce<F extends AnyToAnyFnSignature>(fn: F, wait = 10, thisArg?: object): Debounced<F> {
  let timeout: number | null = null;
  let deferred: Deferred<ReturnType<F>> | null = null;

  function debouncedSubject(...args: any[]) {
    deferred = deferred || createDeferred();
    (typeof timeout === 'number') && clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      timeout = null;
      // fn.apply to save call context
      deferred!.resolve(fn.apply(thisArg || this, args));
      deferred = null;
    }, wait);
  }
  function cancel() {
    (typeof timeout === 'number') && clearTimeout(timeout);
    timeout = null;
    deferred?.reject();
    deferred = null;
  }

  Object.defineProperty(debouncedSubject, 'promise', {
    get: () => deferred ? deferred.promise : Promise.resolve()
  });
  Object.defineProperty(debouncedSubject, 'cancel', {
    writable: false,
    enumerable: false,
    value: cancel
  });

  return debouncedSubject as Debounced<F>;
}
