import SmartCarousel from '../smart-carousel';

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

const strategiesRegistry = new Map<string, SmartCarouselStrategyConstructor>();
export class SmartCarouselStrategyRegistry {
	public static createStrategyInstance(name: string, carousel: SmartCarousel): SmartCarouselStrategy {
		const Strategy = strategiesRegistry.get(name);
		return Strategy ? new Strategy(carousel) : null;
	}
	public static registerStrategy(name: string, strategy: SmartCarouselStrategyConstructor) {
		if (strategiesRegistry.has(name)) {
			throw new Error(`Strategy with name ${name} already defined`);
		}
		strategiesRegistry.set(name, strategy);
	}
}

export default SmartCarouselStrategy;
