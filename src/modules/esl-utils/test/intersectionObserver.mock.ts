import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {wrap} from '../misc/array';
import {Rect} from '../dom/rect';

let original: typeof IntersectionObserver;
let lastMock: IntersectionObserverMock;

export class RectMock extends Rect implements DOMRect {
  public constructor();
  public constructor(x: number, y: number, width: number, height: number);
  public constructor(...args: number[]) {
    if (args.length === 0) super(0, 0, 0, 0);
    else super(...args);
  }
  public toJSON(): DOMRect {
    return this;
  }
}

export class IntersectionObserverMock implements IntersectionObserver {
  public constructor(public callback: IntersectionObserverCallback) {
    this._onObserve = this._onObserve.bind(this);
    this.observe = jest.fn(this.observe);
    this.unobserve = jest.fn(this.unobserve);
    this.disconnect = jest.fn(this.disconnect);
  }

  public root: Document | Element | null = null;
  public rootMargin: string = '';

  public get thresholds(): number[] {
    return [];
  }

  public takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  private _onObserve(e: CustomEvent): void {
    const entries =  wrap(e.detail).map(
      (entry) => IntersectionObserverMock.createEntry(e.target as Element, entry)
    );
    this.callback(entries, this);
  }

  public observe(element: Element): void {
    element.addEventListener('intersection', this._onObserve);
  }

  public unobserve(element: Element): void {
    element.removeEventListener('intersection', this._onObserve);
  }

  public disconnect(): void {}

  public static createEntry(
    target: Element,
    init: Partial<IntersectionObserverEntry>
  ): IntersectionObserverEntry {
    const intersectionRatio = init.intersectionRatio || 0;
    return {
      // Defaults
      target,
      intersectionRect: new RectMock(0, 0, 2000, 2000 * intersectionRatio),
      rootBounds: new RectMock(0, 0, 2000, 2000),
      boundingClientRect: new RectMock(0, 0, 2000, 2000),
      isIntersecting: false,
      intersectionRatio: 0,
      time: Date.now(),
      // Custom
      ...init
    };
  }

  public static trigger(
    $el: Element,
    detail: Partial<IntersectionObserverEntry> | Partial<IntersectionObserverEntry>[]
  ): void {
    ESLEventUtils.dispatch($el, 'intersection', {detail});
  }

  public static mock(): void {
    original = window.IntersectionObserver;
    window.IntersectionObserver = jest.fn(
      (cb) => (lastMock = new IntersectionObserverMock(cb))
    );
  }
  public static unmock(): void {
    window.IntersectionObserver = original;
  }

  public static get lastInstance(): IntersectionObserverMock {
    return lastMock;
  }
}
