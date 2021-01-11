import ESLCarousel from '../esl-carousel';
import {Observable} from '../../../../esl-utils/abstract/observable';

export abstract class ESLCarouselView {
  protected readonly carousel: ESLCarousel;

  protected constructor(carousel: ESLCarousel) {
    this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
  }

  public abstract bind(): void;

  public abstract draw(): void;

  public abstract goTo(nextIndex: number, direction: string): void;

  public abstract unbind(): void;
}

export type ESLCarouselViewConstructor = new(carousel: ESLCarousel) => ESLCarouselView;

let eslRegistryInstance: ESLCarouselViewRegistry | null = null;
export class ESLCarouselViewRegistry extends Observable {
  private registry = new Map<string, ESLCarouselViewConstructor>();

  public static get instance() {
    if (eslRegistryInstance === null) {
      eslRegistryInstance = new ESLCarouselViewRegistry();
    }
    return eslRegistryInstance;
  }

  public createViewInstance(name: string, carousel: ESLCarousel): ESLCarouselView | null {
    const View = this.registry.get(name);
    return View ? new View(carousel) : null;
  }

  public registerView(name: string, view: ESLCarouselViewConstructor) {
    if (this.registry.has(name)) {
      throw new Error(`View with name ${name} already defined`);
    }
    this.registry.set(name, view);
    this.fire(name, view);
  }
}

export default ESLCarouselView;
