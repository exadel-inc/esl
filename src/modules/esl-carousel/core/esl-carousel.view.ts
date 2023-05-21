import {memoize} from '../../esl-utils/decorators';
import {SyntheticEventTarget} from '../../esl-utils/dom';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselDirection} from './nav/esl-carousel.nav.types';

export abstract class ESLCarouselView {
  public static is = '';

  protected readonly carousel: ESLCarousel;
  protected slideWidth: number = 0;

  constructor(carousel: ESLCarousel) {
    this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
  }

  public get type(): string {
    return (this.constructor as typeof ESLCarouselView).is;
  }

  /**  @returns count of carousel slides. */
  public get size(): number {
    return this.carousel.size;
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
  /** Processes drawing of the carousel {@link ESLCarousel}. */
  public redraw(): void {}

  /** Pre-processing animation action. */
  public abstract onBeforeAnimate(index?: number, direction?: ESLCarouselDirection): Promise<void>;
  /** Processes animation. */
  public abstract onAnimate(index: number, direction: ESLCarouselDirection): Promise<void>;
  /** Post-processing animation action. */
  public abstract onAfterAnimate(): Promise<void>;

  /** Handles the slides transition. */
  public abstract onMove(offset: number): void;
  /** Ends current transition and make permanent all changes performed in the transition. */
  public abstract commit(offset?: number): void;

  /** Sets active slides from passed index **/
  public setActive(from: number): void {
    this.carousel.$slides.forEach((el) => el.active = false);
    for (let i = 0; i < this.carousel.count; i++) {
      this.carousel.slideAt(from + i).active = true;
    }
  }

  // Register API
  @memoize()
  public static get registry(): ESLCarouselViewRegistry {
    return new ESLCarouselViewRegistry();
  }
  public static register(view: ESLCarouselViewConstructor): void {
    ESLCarouselView.registry.register(view);
  }
}

export type ESLCarouselViewConstructor = (new(carousel: ESLCarousel) => ESLCarouselView) & typeof ESLCarouselView;

export class ESLCarouselViewRegistry extends SyntheticEventTarget {
  private store = new Map<string, ESLCarouselViewConstructor>();

  public create(name: string, carousel: ESLCarousel): ESLCarouselView {
    let View = this.store.get(name);
    if (!View) [View] = this.store.values(); // take first View in store
    return new View(carousel);
  }

  public register(view: ESLCarouselViewConstructor): void {
    if (!view || !view.is) throw Error('[ESL]: CarouselViewRegistry] incorrect registration request');
    if (this.store.has(view.is)) throw Error(`View with name ${view.is} already defined`);
    this.store.set(view.is, view);
    const detail = {name: view.is, view};
    const event = new CustomEvent('change', {detail});
    this.dispatchEvent(event);
  }
}
