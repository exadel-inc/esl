/**
 * ESLMediaProviderRegistry class to store media API providers
 * @version 1.2.0
 * @author Yuliya Adamskaya
 */
import {Observable} from '../../esl-utils/abstract/observable';
import {BaseProviderConstructor} from './esl-media-provider';

let evRegistryInstance: ESLMediaProviderRegistry | null = null;

export class ESLMediaProviderRegistry extends Observable {
    private providers: Map<string, BaseProviderConstructor> = new Map();

    public static get instance() {
        if (!evRegistryInstance) {
            evRegistryInstance = new ESLMediaProviderRegistry();
        }
        return evRegistryInstance;
    }

    public register(provider: BaseProviderConstructor, name: string) {
        this.providers.set(name, provider);
        this.fire(name, provider);
    }

    public getProvider(name: string) {
        return this.providers.get(name.toLowerCase());
    }

    public has(name: string) {
        return this.providers.has(name);
    }
}

export default ESLMediaProviderRegistry.instance;
