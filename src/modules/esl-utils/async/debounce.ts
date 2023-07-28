import {createDeferred} from './promise/defered';

import type {AnyToAnyFnSignature} from '../misc/functions';
import type {Deferred} from './promise/defered';

/** Debounced<F> is a function wrapper type for a function decorated via debounce */
export interface Debounced<F extends AnyToAnyFnSignature> {
  /** Debounced method signature */
  (...args: Parameters<F>): void;
  /** Promise of deferred function call */
  promise: Promise<ReturnType<F> | void>;
  /** Cancel debounced call */
  cancel(): void;
}

class Debouncer<F extends AnyToAnyFnSignature> {
  public timeout: number | null = null;

  private deferred: Deferred<ReturnType<F>> | null = null;

  private promiseRequested = false;

  constructor(private readonly fn: F, private readonly wait = 10, private readonly thisArg?: object) {}

  public debouncedSubject(that: any, ...args: any[]): void {
    (typeof this.timeout === 'number') && clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => {
      const fn = this.fn.apply(this.thisArg || that, args);
      this.promiseRequested && this.deferred?.resolve(fn);
      this.resetPromise();
    }, this.wait);
  }

  public cancel(): void {
    (typeof this.timeout === 'number') && clearTimeout(this.timeout);
    this.promiseRequested && this.deferred?.reject();
    this.resetPromise();
  }

  private resetPromise(): void {
    this.timeout = null;
    this.deferred = null;
    this.promiseRequested = false;
  }

  public get promise(): Promise<ReturnType<F> | void> {
    this.promiseRequested = true;
    this.deferred = createDeferred();
    return this.deferred.promise;
  }
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
export function debounce<F extends AnyToAnyFnSignature>(fn: F, wait = 10, thisArg?: object): Debounced<F> {
  const instance = new Debouncer(fn, wait, thisArg);

  const debouncer = function (...args: Parameters<F>): void {
    instance.debouncedSubject(this, ...args);
  };

  Object.defineProperty(debouncer, 'promise', {
    get: () => instance.promise
  });
  Object.defineProperty(debouncer, 'cancel', {
    writable: false,
    enumerable: false,
    value: () => instance.cancel()
  });

  return debouncer as Debounced<F>;
}
