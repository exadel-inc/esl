/**
 * ESLMediaProviderRegistry class to store media API providers
 * @version 1.0.0
 * @author Yuliya Adamskaya
 */
import {Observable} from '../../esl-utils/abstract/observable';
import {BaseProviderConstructor} from './esl-media-provider';

interface ProviderMap {
	[name: string]: BaseProviderConstructor;
}

let evRegistryInstance: ESLMediaProviderRegistry = null;
export class ESLMediaProviderRegistry extends Observable {
	private providers: ProviderMap = {};

	public static get instance() {
		if (!evRegistryInstance) {
			evRegistryInstance = new ESLMediaProviderRegistry();
		}
		return evRegistryInstance;
	}

	public register(provider: BaseProviderConstructor, name: string) {
		this.providers[name] = provider;
		this.fire(name, provider);
	}

	public getProvider(name: string) {
		return this.providers[name.toLowerCase()];
	}

	public has(name: string) {
		return Object.prototype.hasOwnProperty.call(this.providers, name);
	}
}

export default ESLMediaProviderRegistry.instance;
