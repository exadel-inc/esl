import {ALL, NOT_ALL} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

/**
 * Simple media condition implementation
 * @author Alexey Stsefanovich (ala'n)
 *
 * Wraps matchMedia instance
 */
export class MediaQueryCondition implements IMediaQueryCondition {
  protected readonly _inverted: boolean;
  protected readonly _mq: MediaQueryList;

  constructor(query: string, inverted = false) {
    this._inverted = inverted;
    this._mq = matchMedia(query.trim() || 'all');
  }

  public get matches(): boolean {
    return this._inverted ? !this._mq.matches : this._mq.matches;
  }

  public addListener(cb: EventListener): void {
    this.addEventListener(cb);
  }
  public addEventListener(callback: EventListener): void;
  public addEventListener(type: 'change', callback: EventListener): void;
  public addEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    if (typeof this._mq.addEventListener === 'function') {
      this._mq.addEventListener('change', callback);
    } else {
      this._mq.addListener(callback);
    }
  }

  public removeListener(cb: EventListener): void {
    this.removeEventListener(cb);
  }
  public removeEventListener(callback: EventListener): void;
  public removeEventListener(type: 'change', callback: EventListener): void;
  public removeEventListener(type: any, callback: EventListener = type): void {
    if (typeof callback !== 'function') return;
    if (typeof this._mq.removeEventListener === 'function') {
      this._mq.removeEventListener('change', callback);
    } else {
      this._mq.removeListener(callback);
    }
  }

  public dispatchEvent(event: Event): boolean {
    return this._mq.dispatchEvent(event);
  }

  /** Optimize query. Can simplify query to {@link MediaQueryConstCondition} */
  public optimize(): IMediaQueryCondition {
    if (ALL.eq(this)) return this._inverted ? NOT_ALL : ALL;
    if (NOT_ALL.eq(this)) return this._inverted ? ALL : NOT_ALL;
    return this;
  }

  public toString(): string {
    const query = this._mq.media;
    const inverted = this._inverted;
    const complex = inverted && /\)[\s\w]+\(/.test(query);
    return (inverted ? 'not ' : '') + (complex ? `(${query})` : query);
  }
}
