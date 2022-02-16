import {Observable} from '../../../esl-utils/abstract/observable';
import {memoize} from '../../../esl-utils/decorators/memoize';

import type {ESLCarousel} from '../esl-carousel';
import type {CarouselDirection} from '../esl-carousel-utils';

export abstract class ESLCarouselView {
  public static is = '';

  protected readonly carousel: ESLCarousel;
  protected slideWidth: number = 0;

  constructor(carousel: ESLCarousel) {
    this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
  }

  public get size(): number {
    return this.carousel.count;
  }

  public bind(): void {
    const type = this.constructor as typeof ESLCarouselView;
    this.carousel.classList.add(`${type.is}-carousel`);

    this.onBind();
  }
  public unbind(): void {
    const type = this.constructor as typeof ESLCarouselView;
    this.carousel.classList.remove(`${type.is}-carousel`);

    this.onUnbind();
  }

  public onBind(): void {}
  public onUnbind(): void {}

  public abstract onBeforeAnimate(index?: number, direction?: CarouselDirection): Promise<void>;
  public abstract onAnimate(index: number, direction: CarouselDirection): Promise<void>;
  public abstract onAfterAnimate(): Promise<void>;

  public abstract onMove(offset: number): void;

  public abstract commit(offset?: number): void;

  // Register API
  @memoize()
  public static get registry(): ESLCarouselViewRegistry {
    return new ESLCarouselViewRegistry();
  }
  public static register(this: typeof ESLCarouselView & ESLCarouselViewConstructor): void {
    this.registry.register(this.is, this);
  }
}
export type ESLCarouselViewConstructor = new(carousel: ESLCarousel) => ESLCarouselView;

export class ESLCarouselViewRegistry extends Observable<(name: string, view: ESLCarouselViewConstructor) => void> {
  private store = new Map<string, ESLCarouselViewConstructor>();

  public create(name: string, carousel: ESLCarousel): ESLCarouselView | null {
    const View = this.store.get(name);
    return View ? new View(carousel) : null;
  }

  public register(name: string, view: ESLCarouselViewConstructor): void {
    if (this.store.has(name)) throw new Error(`View with name ${name} already defined`);
    this.store.set(name, view);
    this.fire(name, view);
  }
}
