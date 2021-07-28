import {ALL, NOT_ALL} from './media-query-base';
import type {IMediaQueryCondition} from './media-query-base';

export class MediaQueryCondition implements IMediaQueryCondition {
  protected readonly _inverted: boolean;
  protected readonly _mq: MediaQueryList;

  constructor(query: string, inverted = false) {
    this._inverted = inverted;
    this._mq = matchMedia(query.trim());
  }

  public get matches() {
    return this._inverted ? !this._mq.matches : this._mq.matches;
  }

  public addListener(listener: () => void) {
    if (typeof this._mq.addEventListener === 'function') {
      this._mq.addEventListener('change', listener);
    } else {
      this._mq.addListener(listener);
    }
  }
  public removeListener(listener: () => void) {
    if (typeof this._mq.removeEventListener === 'function') {
      this._mq.removeEventListener('change', listener);
    } else {
      this._mq.removeListener(listener);
    }
  }

  public optimize(): IMediaQueryCondition {
    if (ALL.eq(this)) return this._inverted ? NOT_ALL : ALL;
    if (NOT_ALL.eq(this)) return this._inverted ? ALL : NOT_ALL;
    return this;
  }

  public toString() {
    return (this._inverted ? 'not ' : '') + this._mq.media;
  }
}
