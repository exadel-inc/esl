import {ESLEventUtils} from '../../esl-event-listener/core/api';
import {bind} from '../../esl-utils/decorators';

export function triggerIntersection($el: Element, cfg: Partial<IntersectionObserverEntryInit>): void {
  ESLEventUtils.dispatch($el, 'intersection', {detail: cfg});
}

export class IntersectionObserverMock {

  public constructor(public callback: IntersectionObserverCallback) {}

  public root: Document | Element | null = null;

  public rootMargin: string = '';

  public get thresholds(): number[] {
    return [];
  }

  public takeRecords(): any {}

  @bind
  private _onObserve(e: any): void {
    const {intersectionRatio, isIntersecting} = e.detail;
    this.callback([{intersectionRatio, target: e.target, isIntersecting}] as IntersectionObserverEntry[], this);
  }

  public observe(element: Element): void {
    element.addEventListener('intersection', this._onObserve);
  }

  public unobserve(element: Element): void {
    element.removeEventListener('intersection', this._onObserve);
  }

  public disconnect = jest.fn();
}
