import {memoize} from '../../esl-utils/decorators';
import {SyntheticEventTarget} from '../../esl-utils/dom';
import {ESLCarouselSlideEvent} from './esl-carousel.events';

import type {ESLCarousel, ESLCarouselActionParams} from './esl-carousel';
import type {ESLCarouselDirection} from './nav/esl-carousel.nav.types';

export abstract class ESLCarouselRenderer {
  public static is: string;

  protected readonly carousel: ESLCarousel;

  constructor(carousel: ESLCarousel) {
    this.carousel = carousel; // TODO: unsafe while lifecycle is not clear
  }

  /** @returns renderer type name */
  public get type(): string {
    return (this.constructor as typeof ESLCarouselRenderer).is;
  }

  /** @returns count of carousel slides */
  public get size(): number {
    return this.carousel.size;
  }
  /** @returns count of visible carousel slides */
  public get count(): number {
    return this.carousel.config.count;
  }
  /** @returns count of carousel slides */
  public get loop(): boolean {
    return this.carousel.config.loop;
  }

  public bind(): void {
    const type = this.constructor as typeof ESLCarouselRenderer;
    this.carousel.classList.add(`${type.is}-carousel`);

    this.onBind();
  }
  public unbind(): void {
    const type = this.constructor as typeof ESLCarouselRenderer;
    this.carousel.classList.remove(`${type.is}-carousel`);

    this.onUnbind();
  }

  /** Processes binding of defined renderer to the carousel {@link ESLCarousel}. */
  public onBind(): void {}
  /** Processes unbinding of defined renderer from the carousel {@link ESLCarousel}. */
  public onUnbind(): void {}
  /** Processes drawing of the carousel {@link ESLCarousel}. */
  public redraw(): void {}
  /** Process slide change process */
  public async navigate(index: number, direction: ESLCarouselDirection, {activator}: ESLCarouselActionParams): Promise<void> {
    const {activeIndex, activeIndexes} = this.carousel;

    if (activeIndex === index && activeIndexes.length === this.count) return;
    if (!this.carousel.dispatchEvent(ESLCarouselSlideEvent.create('BEFORE', {
      direction,
      activator,
      current: activeIndex,
      related: index
    }))) return;

    try {
      await this.onBeforeAnimate(index, direction);
      await this.onAnimate(index, direction);
      await this.onAfterAnimate(index, direction);
    } catch (e: unknown) {
      console.error(e);
    }

    this.setActive(index);

    this.carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', {
      direction,
      activator,
      current: index,
      related: activeIndex
    }));
  }

  /** Pre-processing animation action. */
  public abstract onBeforeAnimate(index?: number, direction?: ESLCarouselDirection): Promise<void>;
  /** Processes animation. */
  public abstract onAnimate(index: number, direction: ESLCarouselDirection): Promise<void>;
  /** Post-processing animation action. */
  public abstract onAfterAnimate(index: number, direction: ESLCarouselDirection): Promise<void>;

  /** Handles the slides transition. */
  public abstract onMove(offset: number): void;
  /** Ends current transition and make permanent all changes performed in the transition. */
  public abstract commit(offset?: number): void;

  /** Sets active slides from passed index **/
  public setActive(from: number): void {
    this.carousel.$slides.forEach((el) => el.active = false);
    for (let i = 0; i < this.count; i++) {
      this.carousel.slideAt(from + i).active = true;
    }
  }

  // Register API
  @memoize()
  public static get registry(): ESLCarouselRendererRegistry {
    return new ESLCarouselRendererRegistry();
  }
  public static register(view: ESLCarouselRendererConstructor): void {
    ESLCarouselRenderer.registry.register(view);
  }
}

export type ESLCarouselRendererConstructor = (new(carousel: ESLCarousel) => ESLCarouselRenderer) & typeof ESLCarouselRenderer;

export class ESLCarouselRendererRegistry extends SyntheticEventTarget {
  private store = new Map<string, ESLCarouselRendererConstructor>();

  public create(name: string, carousel: ESLCarousel): ESLCarouselRenderer {
    let Renderer = this.store.get(name);
    if (!Renderer) [Renderer] = this.store.values(); // take first Renderer in store
    return new Renderer(carousel);
  }

  public register(view: ESLCarouselRendererConstructor): void {
    if (!view || !view.is) throw Error('[ESL]: CarouselRendererRegistry] incorrect registration request');
    if (this.store.has(view.is)) throw Error(`View with name ${view.is} already defined`);
    this.store.set(view.is, view);
    const detail = {name: view.is, view};
    const event = new CustomEvent('change', {detail});
    this.dispatchEvent(event);
  }
}
