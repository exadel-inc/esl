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
