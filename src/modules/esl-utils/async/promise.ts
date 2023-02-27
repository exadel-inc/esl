import type {AnyToAnyFnSignature} from '../misc/functions';

/**
 * @returns Promise that will be resolved or rejected in `timeout` with an optional `payload`
 * If `isReject` is `true` the result promise will be rejected, otherwise (by default) the result promise will be resolved
 */
export function promisifyTimeout<T>(
  timeout: number,
  payload?: T,
  isReject?: boolean
): Promise<T> {
  return new Promise<T>((resolve, reject) =>
    setTimeout((isReject ? reject : resolve).bind(null, payload), timeout)
  );
}

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

/**
 * @returns Promise that will be resolved by dispatching `event` on `target`
 * Or it will be rejected in `timeout` if it's specified
 * Optional `options` for addEventListener can be also specified
 */
export function promisifyEvent(
  target: ListenableTarget,
  event: string,
  timeout?: number | null | undefined,
  options?: boolean | AddEventListenerOptions
): Promise<Event> {
  return new Promise((resolve, reject) => {
    function eventCallback(e: Event): void {
      target.removeEventListener(event, eventCallback, options);
      resolve(e);
    }

    target.addEventListener(event, eventCallback, options);
    if (typeof timeout === 'number' && timeout >= 0) {
      setTimeout(() => reject(new Error('Rejected by timeout')), timeout);
    }
  });
}

/**
 * Short helper to make Promise from element state marker
 * @returns Promise that will be resolved if the target `marker` property is truthful or `event` is dispatched
 * @example
 * `const imgReady = promisifyMarker(eslImage, 'ready');`
 */
export function promisifyMarker(
  target: HTMLElement,
  marker: string,
  event: string = marker
): Promise<HTMLElement> {
  if ((target as any)[marker]) return Promise.resolve(target);
  return promisifyEvent(target, event).then(() => target);
}

/**
 * Call `callback` limited by `tryCount` amount of times with interval in `timeout` ms
 * @returns Promise that will be resolved as soon as callback returns truthy value, or reject it by limit.
 */
export function tryUntil<T>(callback: () => T, tryCount = 2, timeout = 100): Promise<T> {
  return new Promise((resolve, reject) => {
    (function check(): void {
      let result: T | undefined;
      try {
        result = callback();
      } catch {
        result = undefined;
      }

      if (result || tryCount-- < 0) {
        result ? resolve(result) : reject(new Error('Rejected by limit of tries'));
      } else {
        setTimeout(check, timeout);
      }
    })();
  });
}

/**
 * Call async callback in a sequence passed number of times
 * Initial call starts as a microtask
 * @param callback - async chain function
 * @param count - count o calls
 * @returns sequence end promise
 */
export function repeatSequence<T>(callback: () => Promise<T>, count = 1): Promise<T> {
  if (count < 1) return Promise.reject();
  if (count === 1) return Promise.resolve().then(callback);
  return repeatSequence(callback, count - 1).then(callback);
}

/** Deferred object represents promise with it's resolve/reject methods */
export type Deferred<T> = {
  /** Wrapped promise */
  promise: Promise<T>;
  /** Function that resolves wrapped promise */
  resolve: (arg: T) => void;
  /** Function that rejects wrapped promise */
  reject: (arg?: any) => void;
};

/**
 * Create Deferred Object that wraps promise and its resolve and reject callbacks
 */
export function createDeferred<T>(): Deferred<T> {
  let reject: any;
  let resolve: any;
  // Both reject and resolve will be assigned anyway while the Promise constructing.
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {promise, resolve, reject};
}

/** Creates function type with the same signature but with the result type wrapped into promise */
export type PromisifyResultFn<F extends AnyToAnyFnSignature> = (
  ...args: Parameters<F>
) => Promise<ReturnType<F> | void>;

/**
 * Safe wrap for Promise.resolve to use in Promise chain
 * @example
 * `const resolvedPromise = rejectedPromise.catch(resolvePromise);`
 */
export function resolvePromise<T>(arg: T | PromiseLike<T>): Promise<T> {
  return Promise.resolve(arg);
}

/**
 * Safe wrap for Promise.reject to use in Promise chain
 * @example
 * `const rejectedPromise = resolvedPromise.then(rejectPromise);`
 */
export function rejectPromise<T = never>(arg?: T | PromiseLike<T>): Promise<T> {
  return Promise.reject(arg);
}

/**
 * Promise utils helper class
 * Note: use individual methods in case you need correct "tree shaking"
 */
export abstract class PromiseUtils {
  static fromTimeout = promisifyTimeout;
  static fromEvent = promisifyEvent;
  static fromMarker = promisifyMarker;

  static repeat = repeatSequence;
  static tryUntil = tryUntil;

  static deferred = createDeferred;
  static resolve = resolvePromise;
  static reject = rejectPromise;
}
