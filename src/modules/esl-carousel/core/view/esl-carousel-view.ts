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

  /**  @returns count of carousel slides. */
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

  /** Processes binding of defined view to the carousel {@link ESLCarousel}. */
  public onBind(): void {}
  /** Processes unbinding of defined view from the carousel {@link ESLCarousel}. */
  public onUnbind(): void {}

  /** Pre-processing animation action. */
  public abstract onBeforeAnimate(index?: number, direction?: CarouselDirection): Promise<void>;
  /** Processes animation. */
  public abstract onAnimate(index: number, direction: CarouselDirection): Promise<void>;
  /** Post-processing animation action. */
  public abstract onAfterAnimate(): Promise<void>;

  /** Handles the slides transition. */
  public abstract onMove(offset: number): void;
  /** Ends current transition and make permanent all changes performed in the transition. */
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

  public create(name: string, carousel: ESLCarousel): ESLCarouselView {
    let View = this.store.get(name);
    if (!View) [View] = this.store.values(); // take first View in store
    return new View(carousel);
  }

  public register(name: string, view: ESLCarouselViewConstructor): void {
    if (this.store.has(name)) throw new Error(`View with name ${name} already defined`);
    this.store.set(name, view);
    this.fire(name, view);
  }
}
