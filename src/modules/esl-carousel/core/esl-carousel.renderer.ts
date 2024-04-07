import {memoize} from '../../esl-utils/decorators';
import {isEqual} from '../../esl-utils/misc/object';
import {SyntheticEventTarget} from '../../esl-utils/dom';
import {ESLCarouselSlideEvent} from './esl-carousel.events';
import {calcDirection} from './nav/esl-carousel.nav.utils';

import type {ESLCarousel, ESLCarouselActionParams} from './esl-carousel';
import type {ESLCarouselConfig, ESLCarouselDirection} from './nav/esl-carousel.nav.types';
import type {ESLCarouselSlide} from './esl-carousel.slide';
import type {ESLCarouselSlideEventInit} from './esl-carousel.events';

export abstract class ESLCarouselRenderer implements ESLCarouselConfig {
  public static is: string;
  public static classes: string[] = [];

  protected readonly $carousel: ESLCarousel;

  /** (visible) slide count per view */
  public readonly count: number = 0;
  /** cyclic carousel rendering mode */
  public readonly loop: boolean = false;
  /** vertical carousel rendering mode */
  public readonly vertical: boolean = false;

  /** marker if the renderer is applied to the carousel */
  protected _bound: boolean = false;

  constructor($carousel: ESLCarousel, options: ESLCarouselConfig) {
    this.$carousel = $carousel;
    this.count = options.count;
    this.loop = options.loop;
    this.vertical = options.vertical;
  }

  /** @returns renderer type name */
  public get type(): string {
    return (this.constructor as typeof ESLCarouselRenderer).is;
  }

  /** @returns slide total count or 0 if the renderer is not bound */
  public get size(): number {
    return this._bound ? this.$slides.length : 0;
  }

  /** @returns renderer config */
  public get config(): ESLCarouselConfig {
    const {type, size, count, loop, vertical} = this;
    return {type, size, count, loop, vertical};
  }

  /** @returns {@link ESLCarousel} `$slideArea` */
  public get $area(): HTMLElement {
    return this.$carousel.$slidesArea;
  }

  /** @returns {@link ESLCarousel} `$slideArea` */
  public get $slides(): ESLCarouselSlide[] {
    return this.$carousel.$slides || [];
  }

  public equal(config: ESLCarouselConfig): boolean {
    return isEqual(this.config, config);
  }

  public bind(): void {
    this._bound = true;
    const type = this.constructor as typeof ESLCarouselRenderer;
    const orientationCls = `esl-carousel-${this.vertical ? 'vertical' : 'horizontal'}`;
    this.$carousel.classList.add(orientationCls, ...type.classes);

    this.onBind();
  }
  public unbind(): void {
    const type = this.constructor as typeof ESLCarouselRenderer;
    const orientationCls = ['esl-carousel-vertical', 'esl-carousel-horizontal'];
    this.$carousel.classList.remove(...orientationCls, ...type.classes);

    this.onUnbind();
    this._bound = false;
  }

  /** Processes binding of defined renderer to the carousel {@link ESLCarousel}. */
  public onBind(): void {}
  /** Processes unbinding of defined renderer from the carousel {@link ESLCarousel}. */
  public onUnbind(): void {}
  /** Processes drawing of the carousel {@link ESLCarousel}. */
  public redraw(): void {}
  /** Process slide change process */
  public async navigate(index: number, direction: ESLCarouselDirection, {activator}: ESLCarouselActionParams): Promise<void> {
    const {activeIndex, activeIndexes} = this.$carousel;

    if (activeIndex === index && activeIndexes.length === this.count) return;
    if (!this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('BEFORE', {
      direction,
      activator,
      current: activeIndex,
      related: index
    }))) return;

    this.setPreActive(index);

    try {
      await this.onBeforeAnimate(index, direction);
      await this.onAnimate(index, direction);
      await this.onAfterAnimate(index, direction);
    } catch (e: unknown) {
      console.error(e);
    }

    this.clearPreActive();
    this.setActive(index, {direction, activator});
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
  public setActive(current: number, event?: Partial<ESLCarouselSlideEventInit>): void {
    const related = this.$carousel.activeIndex;

    this.$carousel.$slides.forEach((el) => el.active = false);
    const count = Math.min(this.count, this.size);
    for (let i = 0; i < count; i++) {
      this.$carousel.slideAt(current + i).active = true;
    }

    if (event && typeof event === 'object') {
      const direction = event.direction || calcDirection(related, current, this.size);
      const details = {...event, direction, current, related};
      this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', details));
    }
  }

  public setPreActive(from: number): void {
    this.clearPreActive();
    const count = Math.min(this.count, this.size);
    for (let i = from; i < from + count; i++) {
      const $slide = this.$carousel.slideAt(i);
      if (!$slide.active) {
        $slide.preActive = true;
      }
    }
  }

  public clearPreActive(): void {
    this.$carousel.$slides.forEach((el) => el.preActive = false);
  }

  // Register API
  @memoize()
  public static get registry(): ESLCarouselRendererRegistry {
    return new ESLCarouselRendererRegistry();
  }
  public static register(view: ESLCarouselRendererConstructor = this as any): void {
    ESLCarouselRenderer.registry.register(view);
  }
}

export type ESLCarouselRendererConstructor = (new(carousel: ESLCarousel, config: ESLCarouselConfig) => ESLCarouselRenderer) & typeof ESLCarouselRenderer;

export class ESLCarouselRendererRegistry extends SyntheticEventTarget {
  private store = new Map<string, ESLCarouselRendererConstructor>();

  public create(carousel: ESLCarousel, config: ESLCarouselConfig): ESLCarouselRenderer {
    let Renderer = this.store.get(config.type);
    if (!Renderer) [Renderer] = this.store.values(); // take first Renderer in store
    return new Renderer(carousel, config);
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
