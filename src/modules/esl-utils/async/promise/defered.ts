export type Deferred<T> = {
  /** Wrapped promise */
  promise: Promise<T>;
  /** Function that resolves wrapped promise */
  resolve: (arg: T) => void;
  /** Function that rejects wrapped promise */
  reject: (arg?: any) => void;
};

/**
 * LazyDeferred represents a promise with its resolve/reject methods.
 * The underlying Promise is created lazily when accessed.
 */
class LazyDeferred<T> implements Deferred<T> {
  private _promise: Promise<T>;
  private _resolve: (value: T) => void;
  private _reject: (reason?: any) => void;

  private _promiseRequested: Promise<void>;
  private _resolveRequested: () => void;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._promiseRequested = new Promise<void>((resolve) => this._resolveRequested = resolve);
  }

  public get promise(): Promise<T> {
    this._resolveRequested();
    return this._promise;
  }

  public resolve(arg: T): void {
    this._promiseRequested.then(() => this._resolve(arg));
  }

  public reject(arg?: any): void {
    this._promiseRequested.then(() => this._reject(arg));
  }
}

/**
 * Creates Deferred Object that wraps promise and its resolve and reject callbacks
 */
export function createDeferred<T>(): Deferred<T> {
  return new LazyDeferred<T>();
}
