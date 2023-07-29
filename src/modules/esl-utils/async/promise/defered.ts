type PromiseAction<T> = {
  type: 'resolve';
  arg: T;
} | {
  type: 'reject';
  arg?: any;
};

/**
 * Deferred represents a promise with its resolve/reject methods.
 * The underlying Promise is created lazily when accessed.
 */
export class Deferred<T> implements Deferred<T> {
  private _promise: Promise<T>;
  private _resolve: (value: T) => void;
  private _reject: (reason?: any) => void;

  private _promiseCallback?: PromiseAction<T>;
  private _promiseRequested = false;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  /** Wrapped promise */
  public get promise(): Promise<T> {
    const {_promiseCallback} = this;
    if (!this._promiseRequested && _promiseCallback) {
      const {arg, type} = _promiseCallback;
      type === 'resolve' ? this._resolve(arg) : this._reject(arg);
    }
    this._promiseRequested = true;
    return this._promise;
  }

  /** Function that resolves wrapped promise */
  public resolve(arg: T): void {
    this._promiseRequested && this._resolve(arg);
    if (!this._promiseCallback) this._promiseCallback = {type: 'resolve', arg};
  }

  /** Function that rejects wrapped promise */
  public reject(arg?: any): void {
    this._promiseRequested && this._reject(arg);
    if (!this._promiseCallback) this._promiseCallback = {type: 'reject', arg};
  }
}

/**
 * Creates Deferred Object that wraps promise and its resolve and reject callbacks
 */
export function createDeferred<T>(): Deferred<T> {
  return new Deferred();
}
