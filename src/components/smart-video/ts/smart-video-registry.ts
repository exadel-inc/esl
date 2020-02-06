/**
 * Video Registry class to store video API providers
 * @version 1.0.0
 * @author Yuliya Adamskaya
 */
import {Observable} from '@helpers/abstract/observable';
import {BaseProviderConstructor} from './smart-video-provider';

interface ProviderMap {
	[name: string]: BaseProviderConstructor;
}

let evRegistryInstance: EmbeddedVideoProviderRegistry = null;
export class EmbeddedVideoProviderRegistry extends Observable {
	private providers: ProviderMap = {};

	public static get instance() {
		if (!evRegistryInstance) {
			evRegistryInstance = new EmbeddedVideoProviderRegistry();
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
}

export default EmbeddedVideoProviderRegistry.instance;
