import type {AnyToVoidFnSignature} from '../misc/functions';

/**
 * Abstract Observable implementation
 * @author Yuliya Adamskaya
 */
export abstract class Observable <Callback extends AnyToVoidFnSignature = AnyToVoidFnSignature>{
  private _listeners = new Set<Callback>();

  public addListener(listener: Callback) {
    this._listeners.add(listener);
  }
  public removeListener(listener: Callback) {
    this._listeners.delete(listener);
  }

  protected fire(...args: Parameters<Callback>) {
    this._listeners.forEach((listener) => {
      try {
        listener.apply(this, args);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
