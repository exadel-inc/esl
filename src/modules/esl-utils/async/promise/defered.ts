import {memoize} from '../../decorators/memoize';

/** Deferred object that represents promise with its resolve/reject methods */
export class Deferred<T> {
  protected _status: 'pending' | 'resolved' | 'rejected' = 'pending';
  protected _value: T | undefined;
  protected _callbacks: [(arg: T) => void, (arg?: any) => void];

  /** @returns promise based on {@link Deferred} state*/
  @memoize()
  public get promise(): Promise<T> {
    if (this._status === 'resolved') return Promise.resolve(this._value as T);
    if (this._status === 'rejected') return Promise.reject(this._value);
    return new Promise<T>((res, rej) => {
      this._callbacks = [res, rej];
    });
  }

  /** Resolves deferred promise */
  public resolve(arg: T): Deferred<T> {
    if (this._status === 'pending') {
      this._value = arg;
      this._status = 'resolved';
      this._callbacks && this._callbacks[0](arg);
    }
    return this;
  }

  /** Rejects deferred promise */
  public reject(arg?: any): Deferred<T> {
    if (this._status === 'pending') {
      this._value = arg;
      this._status = 'rejected';
      this._callbacks && this._callbacks[1](arg);
    }
    return this;
  }
}

/** Creates Deferred Object that wraps promise and its resolve and reject callbacks */
export function createDeferred<T>(): Deferred<T> {
  return new Deferred();
}
