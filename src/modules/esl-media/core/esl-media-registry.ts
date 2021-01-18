/**
 * ESLMediaProviderRegistry class to store media API providers
 * @version 1.0.0-alpha
 * @author Yuliya Adamskaya, Natallia Harshunova
 */
import ESLMedia from './esl-media';
import {Observable} from '../../esl-utils/abstract/observable';
import type {BaseProvider, ProviderType} from './esl-media-provider';

let evRegistryInstance: ESLMediaProviderRegistry | null = null;
export class ESLMediaProviderRegistry extends Observable {
  private providersMap: Map<string, ProviderType> = new Map();

  public static get instance() {
    if (!evRegistryInstance) {
      evRegistryInstance = new ESLMediaProviderRegistry();
    }
    return evRegistryInstance;
  }

  /** List of registered providers */
  public get providers(): ProviderType[] {
    const list: ProviderType[] = [];
    this.providersMap.forEach((provider) => list.push(provider));
    return list;
  }

  /** Register provider */
  public register(provider: ProviderType) {
    if (!provider.providerName) throw new Error('Provider should have a name');
    this.providersMap.set(provider.providerName, provider);
    this.fire(provider.providerName, provider);
  }

  /** Check that provider is registered for passed name */
  public has(name: string) {
    return this.providersMap.has(name);
  }

  /** Find provider by name */
  public findByName(name: string) {
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
  private static _create(provider: ProviderType, media: ESLMedia, cfg = provider.parseUrl(media.mediaSrc)) {
    const config = Object.assign({}, cfg || {}, provider.parseConfig(media));
    return new provider(media, config);
  }
}

export default ESLMediaProviderRegistry.instance;
