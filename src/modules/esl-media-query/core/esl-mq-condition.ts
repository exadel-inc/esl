import {memoize} from '../../esl-utils/decorators/memoize';

import {ALL, NOT_ALL} from './esl-mq-base';
import type {IESLMQCondition} from './esl-mq-base';

export class ESLMQCondition implements IESLMQCondition {
  /** Cached version of {@link matchMedia} */
  @memoize()
  protected static matchMediaCached(query: string) {
    return matchMedia(query);
  }

  protected readonly _inverted: boolean;
  protected readonly _mq: MediaQueryList;

  constructor(query: string) {
    const clearQuery = query.replace(/^\s*not\s+/, '');
    this._inverted = query !== clearQuery;
    this._mq = ESLMQCondition.matchMediaCached(clearQuery.trim());
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

  public optimize(): IESLMQCondition {
    if (ALL.eq(this)) return this._inverted ? NOT_ALL : ALL;
    if (NOT_ALL.eq(this)) return this._inverted ? ALL : NOT_ALL;
    return this;
  }

  public toString() {
    return (this._inverted ? 'not ' : '') + this._mq.media;
  }
}
