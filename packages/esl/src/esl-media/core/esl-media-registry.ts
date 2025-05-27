import {SyntheticEventTarget} from '../../esl-utils/dom/events/target';
import {ESLMediaRegistryEvent} from './esl-media-registry.event';

import type {BaseProvider, ProviderType} from './esl-media-provider';
import type {ESLMedia} from './esl-media';

let evRegistryInstance: ESLMediaProviderRegistry | null = null;
/**
 * ESLMediaProviderRegistry class to store media API providers
 * @author Yuliya Adamskaya, Natallia Harshunova
 */
export class ESLMediaProviderRegistry extends SyntheticEventTarget {
  protected providersMap: Map<string, ProviderType> = new Map();

  public static get instance(): ESLMediaProviderRegistry {
    if (!evRegistryInstance) {
      evRegistryInstance = new ESLMediaProviderRegistry();
    }
    return evRegistryInstance;
  }

  /** List of registered providers */
  public get providers(): ProviderType[] {
    return Array.from(this.providersMap.values());
  }

  /** Register provider */
  public register(provider: ProviderType): void {
    if (!provider.providerName) throw new Error('Provider should have a name');
    this.providersMap.set(provider.providerName, provider);
    this.dispatchEvent(new ESLMediaRegistryEvent(this, provider));
  }

  /** Check that provider is registered for passed name */
  public has(name: string): boolean {
    return this.providersMap.has(name);
  }

  /** Find provider by name */
  public findByName(name: string): ProviderType | null {
    if (!name || name === 'auto') return null;
    return this.providersMap.get(name.toLowerCase()) || null;
  }

  /** Create provider instance for passed ESLMedia instance */
  public createFor(media: ESLMedia): BaseProvider | null {
    return this.createByType(media) || this.createBySrc(media);
  }

  /** Create provider instance for passed ESLMedia instance via provider name */
  private createByType(media: ESLMedia): BaseProvider | null {
    const provider = this.findByName(media.mediaType);
    return provider ? ESLMediaProviderRegistry._create(provider, media) : null;
  }

  /** Create provider instance for passed ESLMedia instance via url */
  private createBySrc(media: ESLMedia): BaseProvider | null {
    for (const provider of this.providers.reverse()) {
      const cfg = provider.parseUrl(media.mediaSrc);
      if (cfg) return ESLMediaProviderRegistry._create(provider, media, cfg);
    }
    return null;
  }

  /** Create provider instance for passed configuration */
  private static _create(provider: ProviderType, media: ESLMedia, cfg = provider.parseUrl(media.mediaSrc)): BaseProvider {
    const config = Object.assign({}, cfg || {}, provider.parseConfig(media));
    const instance = new provider(media, config);
    if (instance) {
      instance.bind();
      console.debug('[ESL] Media provider created', instance);
    }
    return instance;
  }
}
