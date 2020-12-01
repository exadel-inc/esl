import type {AnyToAnyFnSignature} from '../misc/functions';

/** Interface to describe abstract listenable target */
export type ListenableTarget = {
  addEventListener: (
    event: string,
    callback: (payload: any) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void;
  removeEventListener: (
    event: string,
    callback: (payload: any) => void,
    options?: boolean | AddEventListenerOptions | undefined
  ) => void;
};

/** Deferred object represents promise with it's resolve/reject methods */
export type Deferred<T> = {
  /** Wrapped promise */
  promise: Promise<T>;
  /** Function that resolves wrapped promise */
  resolve: (arg: T) => void;
  /** Function that reject wrapped promise */
  reject: (arg?: any) => void;
};

/** Return function type with the same signature but with the result type wrapped into promise */
export type PromisifyResultFn<F extends AnyToAnyFnSignature> =
  ((...args: Parameters<F>) => Promise<ReturnType<F> | void>);

/**
 * Promise utils helper class
 */
export abstract class PromiseUtils {
  /**
   * @return {Promise} that will be resolved in {@param timeout} with optional {@param payload}
   */
  static fromTimeout<T>(timeout: number, payload?: T): Promise<T> {
    return new Promise<T>((resolve) =>
      setTimeout(resolve.bind(null, payload), timeout)
    );
  }

  /**
   * @return {Promise} that will be resolved by dispatching {@param event} on {@param target}
   * Or it will be rejected in {@param timeout} if it's specified
   * Optional {@param options} for addEventListener can be also specified
   */
  static fromEvent(
    target: ListenableTarget,
    event: string,
    timeout?: number | null | undefined,
    options?: boolean | AddEventListenerOptions
  ): Promise<Event> {
    return new Promise((resolve, reject) => {
      function eventCallback(...args: any) {
        target.removeEventListener(event, eventCallback, options);
        resolve(...args);
      }

      target.addEventListener(event, eventCallback, options);
      if (typeof timeout === 'number' && timeout >= 0) {
        setTimeout(() => reject(new Error('Rejected by timeout')), timeout);
      }
    });
  }

  /**
   * Short helper to make Promise from element state marker
   * Marker should be accessible and listenable
   * @example
   * const imgReady = PromiseUtils.fromMarker(eslImage, 'ready');
   */
  static fromMarker(target: HTMLElement, marker: string, event?: string): Promise<HTMLElement> {
    if ((target as any)[marker]) return Promise.resolve(target);
    return PromiseUtils.fromEvent(target, event || marker).then(() => target);
  }

  /**
   * Safe wrap for Promise.resolve to use in Promise chain
   * @example
   * const resolvedPromise = rejectedPromise.catch(PromiseUtils.resolve);
   */
  static resolve<T>(arg: T | PromiseLike<T>): Promise<T> {
    return Promise.resolve(arg);
  }

  /**
   * Safe wrap for Promise.reject to use in Promise chain
   * @example
   * const rejectedPromise = resolvedPromise.then(PromiseUtils.resolve);
   */
  static reject<T = never>(arg?: T | PromiseLike<T>): Promise<T> {
    return Promise.reject(arg);
  }

  /**
   * Call {@param callback} limited by {@param tryCount} amount of times with interval in {@param timeout} ms
   * @return {Promise} that will be resolved as soon as callback returns truthy value, or reject it by limit.
   */
  static tryUntil<T>(callback: () => T, tryCount = 2, timeout = 100): Promise<T> {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        let result: T | undefined;
        try {
          result = callback();
        } catch {
          result = undefined;
        }
        if (result || --tryCount < 0) {
          clearInterval(interval);
          result ? resolve(result) : reject(new Error('Rejected by limit of tries'));
        }
      }, timeout);
    });
  }

  /**
   * Create Deferred Object that wraps promise and it's resolve and reject callbacks
   */
  static deferred<T>(): Deferred<T> {
    let reject: any;
    let resolve: any;
    // Both reject and resolve will be assigned anyway while the Promise constructing.
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {promise, resolve, reject};
  }
}
