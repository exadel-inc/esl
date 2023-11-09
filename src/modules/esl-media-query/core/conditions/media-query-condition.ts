import {SyntheticEventTarget} from '../../../esl-utils/dom/events';
import {ALL, NOT_ALL} from './media-query-const';
import {ESLMediaChangeEvent} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

/**
 * Simple media condition implementation
 * @author Alexey Stsefanovich (ala'n)
 *
 * Wraps matchMedia instance
 */
export class MediaQueryCondition extends SyntheticEventTarget implements IMediaQueryCondition {
  protected readonly _inverted: boolean;
  protected readonly _mq: MediaQueryList;

  constructor(query: string, inverted = false) {
    super();
    this._inverted = inverted;
    this._mq = matchMedia(query.trim() || 'all');
    this._onChange = this._onChange.bind(this);
  }

  public get matches(): boolean {
    return this._inverted ? !this._mq.matches : this._mq.matches;
  }

  public override addEventListener(callback: EventListener): void;
  public override addEventListener(type: 'change', callback: EventListener): void;
  public override addEventListener(type: any, callback: EventListener = type): void {
    super.addEventListener(type, callback);
    if (this.getEventListeners('change').length > 1) return;
    if (typeof this._mq.addEventListener === 'function') {
      this._mq.addEventListener('change', this._onChange);
    } else {
      this._mq.addListener(this._onChange);
    }
  }

  public override removeEventListener(callback: EventListener): void;
  public override removeEventListener(type: 'change', callback: EventListener): void;
  public override removeEventListener(type: any, callback: EventListener = type): void {
    super.removeEventListener(type, callback);
    if (this.hasEventListener()) return;
    if (typeof this._mq.removeEventListener === 'function') {
      this._mq.removeEventListener('change', this._onChange);
    } else {
      this._mq.removeListener(this._onChange);
    }
  }

  /** Optimize query. Can simplify query to {@link MediaQueryConstCondition} */
  public optimize(): IMediaQueryCondition {
    if (ALL.eq(this)) return this._inverted ? NOT_ALL : ALL;
    if (NOT_ALL.eq(this)) return this._inverted ? ALL : NOT_ALL;
    return this;
  }

  public override toString(): string {
    const query = this._mq.media;
    const inverted = this._inverted;
    const complex = inverted && /\)[\s\w]+\(/.test(query);
    return (inverted ? 'not ' : '') + (complex ? `(${query})` : query);
  }

  /** Handles query change and dispatches it on top level in case result value is changed */
  protected _onChange(): void {
    this.dispatchEvent(new ESLMediaChangeEvent(this._mq.matches));
  }
}
