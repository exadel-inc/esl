import {overrideEvent} from '../../esl-utils/dom/events/misc';

import type {ESLMediaProviderRegistry} from './esl-media-registry';
import type {ProviderType} from './esl-media-provider';

export class ESLMediaRegistryEvent extends Event {
  public override readonly target: ESLMediaProviderRegistry;
  public readonly provider: ProviderType;

  constructor(target: ESLMediaProviderRegistry, provider: ProviderType) {
    super('change', {bubbles: false, cancelable: false});
    this.provider = provider;
    overrideEvent(this, 'target', target);
  }

  public is(name: string): boolean {
    name = name.toLowerCase();
    return name === 'auto' || this.provider?.providerName === name;
  }
}
