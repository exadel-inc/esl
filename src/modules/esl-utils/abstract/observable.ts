/**
 * Abstract Observable implementation
 * @author Yuliya Adamskaya
 */
export type ObserverCallback = (...args: any) => void;

export abstract class Observable {
  private _listeners = new Set<ObserverCallback>();

  public addListener(listener: ObserverCallback) {
    this._listeners.add(listener);
  }
  public removeListener(listener: ObserverCallback) {
    this._listeners.delete(listener);
  }

  protected fire(...args: any) {
    this._listeners.forEach((listener) => {
      try {
        listener.apply(this, args);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
