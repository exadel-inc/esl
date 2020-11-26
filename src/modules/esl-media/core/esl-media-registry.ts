/**
 * ESLMediaProviderRegistry class to store media API providers
 * @version 1.0.0-alpha
 * @author Yuliya Adamskaya
 */
import type {ProviderType} from './esl-media-provider';
import {Observable} from '../../esl-utils/abstract/observable';

let evRegistryInstance: ESLMediaProviderRegistry | null = null;

export class ESLMediaProviderRegistry extends Observable {
  private providers: Map<string, ProviderType> = new Map();

  public static get instance() {
    if (!evRegistryInstance) {
      evRegistryInstance = new ESLMediaProviderRegistry();
    }
    return evRegistryInstance;
  }

  public register(provider: ProviderType, name: string) {
    if (!name) throw new Error(`Provider name "${name}" is incorrect`);
    this.providers.set(name, provider);
    this.fire(name, provider);
  }

  public getProvider(name: string) {
    return this.providers.get(name.toLowerCase()) || null;
  }

  public has(name: string) {
    return this.providers.has(name);
  }
}

export default ESLMediaProviderRegistry.instance;
