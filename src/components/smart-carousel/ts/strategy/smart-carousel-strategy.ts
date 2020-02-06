import SmartCarousel from '../smart-carousel';
import {Observable} from '@helpers/abstract/observable';

// TODO: rename? possibly SmartCarouselView
export abstract class SmartCarouselStrategy {
	protected readonly carousel: SmartCarousel;

	protected constructor(carousel: SmartCarousel) {
		this.carousel = carousel; // TODO: unsafe while live-cycle is not clear
	}

	public abstract onAnimate(nextIndex: number, direction: string): void;

	public abstract cleanStyles(): void;
}

export type SmartCarouselStrategyConstructor = new(carousel: SmartCarousel) => SmartCarouselStrategy;

let scRegistryInstance: SmartCarouselStrategyRegistry = null;
export class SmartCarouselStrategyRegistry extends Observable {
	private registry = new Map<string, SmartCarouselStrategyConstructor>();

	public static get instance() {
		if (scRegistryInstance === null) {
			scRegistryInstance = new SmartCarouselStrategyRegistry();
		}
		return scRegistryInstance;
	}

	public createStrategyInstance(name: string, carousel: SmartCarousel): SmartCarouselStrategy {
		const Strategy = this.registry.get(name);
		return Strategy ? new Strategy(carousel) : null;
	}

	public registerStrategy(name: string, strategy: SmartCarouselStrategyConstructor) {
		if (this.registry.has(name)) {
			throw new Error(`Strategy with name ${name} already defined`);
		}
		this.registry.set(name, strategy);
		this.fire(name, strategy);
	}
}

export default SmartCarouselStrategy;
