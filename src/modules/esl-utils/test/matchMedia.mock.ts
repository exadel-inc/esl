import {memoizeFn} from '../misc/memoize';

export class MatchMediaMock implements MediaQueryList {
  private _matches;
  private _listeners = new Set<VoidFunction>();

  constructor(
    public readonly media: string
  ) {
    this._matches = (media === '' || media === 'all');
  }

  get matches() {
    return this._matches;
  }
  set matches(match) {
    this.set(match);
  }

  set(matches: boolean, notify = (matches === this._matches)) {
    this._matches = matches;
    if (!notify) return;
    this._listeners.forEach((cb) => cb());
  }

  onchange() {}
  dispatchEvent(event: Event) {
    this._listeners.forEach((cb) => cb());
    return false;
  }
  addListener(cb: any) {
    this._listeners.add(cb);
  }
  removeListener(cb: any) {
    this._listeners.delete(cb);
  }
  addEventListener(event: string, cb: any) {
    this.addListener(cb);
  }
  removeEventListener(event: string, cb: any) {
    this.removeListener(cb);
  }
}

export const getMatchMediaMock = memoizeFn(
  (query: string) => new MatchMediaMock(query)
);
export const matchMediaMock = jest.fn((q) => getMatchMediaMock(q.trim()));

Object.defineProperty(window, 'matchMedia', {writable: true, value: matchMediaMock});
