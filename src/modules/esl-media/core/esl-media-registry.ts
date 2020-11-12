/**
 * ESLMediaProviderRegistry class to store media API providers
 * @version 1.2.0
 * @author Yuliya Adamskaya
 */
import ESLMedia from './esl-media';
import {Observable} from '../../esl-utils/abstract/observable';
import {BaseProvider, ProviderType} from './esl-media-provider';

let evRegistryInstance: ESLMediaProviderRegistry | null = null;

export class ESLMediaProviderRegistry extends Observable {
  private providersMap: Map<string, ProviderType> = new Map();

  public static get instance() {
    if (!evRegistryInstance) {
      evRegistryInstance = new ESLMediaProviderRegistry();
    }
    return evRegistryInstance;
  }

  public get providers(): ProviderType[] {
    const list: ProviderType[] = [];
    this.providersMap.forEach((provider) => list.push(provider));
    return list;
  }

  public register(provider: ProviderType, name: string) {
    this.providersMap.set(name, provider);
    this.fire(name, provider);
  }

  public has(name: string) {
    return this.providersMap.has(name);
  }

  public getProviderByType(type: string) {
    if (!type || type === 'auto') return null;
    return this.providersMap.get(type.toLowerCase()) || null;
  }

  public createProvider(media: ESLMedia): BaseProvider<HTMLElement> | null {
    return this.createProviderByType(media) || this.createProviderBySrc(media);
  }

  private createProviderByType(media: ESLMedia): BaseProvider<HTMLElement> | null {
    const {mediaType, mediaSrc} = media;
    const providerByType = this.getProviderByType(mediaType);
    if (providerByType) {
      const config = Object.assign({}, providerByType.parseURL(mediaSrc), providerByType.parseConfig(media));
      return new providerByType(media, config);
    }
    return null;
  }

  private createProviderBySrc(media: ESLMedia): BaseProvider<HTMLElement> | null {
    const {mediaSrc} = media;
    for (const provider of this.providers) {
      const parsedConfig = provider.parseURL(mediaSrc);
      if (!parsedConfig) continue;
      const config = Object.assign({}, parsedConfig, provider.parseConfig(media));
      return new provider(media, config);
    }
    return null;
  }
}

export default ESLMediaProviderRegistry.instance;
