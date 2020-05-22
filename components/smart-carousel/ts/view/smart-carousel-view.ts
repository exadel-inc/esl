import SmartCarousel from '../smart-carousel';
import {Observable} from '../../../smart-utils/abstract/observable';

export abstract class SmartCarouselView {
	protected readonly carousel: SmartCarousel;

	protected constructor(carousel: SmartCarousel) {
		this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
	}

	public abstract bind(): void;

	public abstract draw(): void;

	public abstract goTo(nextIndex: number, direction: string): void;

	public abstract unbind(): void;
}

export type SmartCarouselViewConstructor = new(carousel: SmartCarousel) => SmartCarouselView;

let scRegistryInstance: SmartCarouselViewRegistry = null;
export class SmartCarouselViewRegistry extends Observable {
	private registry = new Map<string, SmartCarouselViewConstructor>();

	public static get instance() {
		if (scRegistryInstance === null) {
			scRegistryInstance = new SmartCarouselViewRegistry();
		}
		return scRegistryInstance;
	}

	public createViewInstance(name: string, carousel: SmartCarousel): SmartCarouselView {
		const View = this.registry.get(name);
		return View ? new View(carousel) : null;
	}

	public registerView(name: string, view: SmartCarouselViewConstructor) {
		if (this.registry.has(name)) {
			throw new Error(`View with name ${name} already defined`);
		}
		this.registry.set(name, view);
		this.fire(name, view);
	}
}

export default SmartCarouselView;
