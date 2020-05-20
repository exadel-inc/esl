/**
 * SmartMediaProviderRegistry class to store media API providers
 * @version 1.0.0
 * @author Yuliya Adamskaya
 */
import {Observable} from '../../../core/abstract/observable';
import {BaseProviderConstructor} from './smart-media-provider';

interface ProviderMap {
	[name: string]: BaseProviderConstructor;
}

let evRegistryInstance: SmartMediaProviderRegistry = null;
export class SmartMediaProviderRegistry extends Observable {
	private providers: ProviderMap = {};

	public static get instance() {
		if (!evRegistryInstance) {
			evRegistryInstance = new SmartMediaProviderRegistry();
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

export default SmartMediaProviderRegistry.instance;
