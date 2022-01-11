import {Observable} from '../../../esl-utils/abstract/observable';

import type {CarouselDirection, ESLCarousel} from '../esl-carousel';

export abstract class ESLCarouselView {
  protected readonly carousel: ESLCarousel;
  public static is = '';

  protected constructor(carousel: ESLCarousel) {
    this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
  }

  public abstract bind(): void;
  public abstract unbind(): void;

  public abstract onBeforeAnimate(index?: number, direction?: CarouselDirection): Promise<void>;
  public abstract onAnimate(index: number, direction: CarouselDirection): Promise<void>;
  public abstract onAfterAnimate(): Promise<void>;

  public abstract onMove(offset: number): void;

  public abstract commit(direction?: CarouselDirection): void;

  public abstract draw(): void;
}

export type ESLCarouselViewConstructor = new(carousel: ESLCarousel) => ESLCarouselView;

let eslRegistryInstance: ESLCarouselViewRegistry | null = null;
export class ESLCarouselViewRegistry extends Observable<(name: string, view: ESLCarouselViewConstructor) => void> {
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
