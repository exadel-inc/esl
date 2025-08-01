import {overrideEvent} from '../../esl-utils/dom/events/misc';

import type {ESLMediaProviderRegistry} from './esl-media-registry';
import type {ProviderType} from './esl-media-provider';

/**
 * An event dispatched by {@link ESLMediaProviderRegistry} on new provider registration
 */
export class ESLMediaRegistryEvent extends Event {
  public static readonly TYPE = 'change';

  public override readonly type: typeof ESLMediaRegistryEvent.TYPE;

  public override readonly target: ESLMediaProviderRegistry;

  /** Registered provider instance */
  public readonly provider: ProviderType;

  constructor(target: ESLMediaProviderRegistry, provider: ProviderType) {
    super(ESLMediaRegistryEvent.TYPE, {bubbles: false, cancelable: false});
    this.provider = provider;
    overrideEvent(this, 'target', target);
  }

  /** Checks if the event relates to passed provider name */
  public isRelates(name: string): boolean {
    name = name.toLowerCase() || 'auto';
    return name === 'auto' || this.provider?.providerName === name;
  }
}
