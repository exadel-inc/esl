import {memoize} from '../../esl-utils/decorators';
import {isEqual} from '../../esl-utils/misc/object';
import {SyntheticEventTarget} from '../../esl-utils/dom';
import {ESLCarouselSlideEvent} from './esl-carousel.events';
import {normalize, sequence, indexToDirection, normalizeIndex} from './nav/esl-carousel.nav.utils';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselActionParams, ESLCarouselConfig, ESLCarouselDirection, ESLCarouselNavInfo} from './esl-carousel.types';
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

  /** @returns marker if the renderer is applied to the carousel */
  public get bound(): boolean {
    return this._bound;
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

  /** @returns {@link ESLCarousel} `$slidesArea` */
  public get $area(): HTMLElement {
    return this.$carousel.$slidesArea;
  }

  /** @returns {@link ESLCarousel} `$slides` */
  public get $slides(): HTMLElement[] {
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
    if (!this._bound) return;

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

  /** Normalizes an index before navigation */
  protected normalizeIndex(index: number, params?: ESLCarouselActionParams): number {
    return normalizeIndex(index, this);
  }
  /** Normalizes a direction before navigation */
  protected normalizeDirection(direction: ESLCarouselDirection | undefined, params?: ESLCarouselActionParams): ESLCarouselDirection {
    return (this.loop ? params && params.direction : null) || direction || 'next';
  }

  /** Processes changing slides */
  public async navigate(to: ESLCarouselNavInfo, params: ESLCarouselActionParams): Promise<void> {
    const index = this.normalizeIndex(to.index, params);
    const direction = this.normalizeDirection(to.direction, params);

    const indexesAfter = sequence(index, this.count, this.size);
    const indexesBefore = this.$carousel.activeIndexes;

    if (indexesBefore.toString() === indexesAfter.toString()) return;
    if (!this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('BEFORE', {
      ...params,
      direction,
      indexesBefore,
      indexesAfter
    }))) return;

    this.setPreActive(index);

    try {
      await this.onBeforeAnimate(index, direction);
      await this.onAnimate(index, direction);
      await this.onAfterAnimate(index, direction);
    } catch (e: unknown) {
      console.error(e);
    }

    this.setActive(index, {direction, ...params});
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(index?: number, direction?: ESLCarouselDirection): Promise<void> {}
  /** Processes animation. */
  public abstract onAnimate(index: number, direction: ESLCarouselDirection): Promise<void>;
  /** Post-processing animation action. */
  public async onAfterAnimate(index: number, direction: ESLCarouselDirection): Promise<void> {}

  /**
   * Moves slide by the passed offset in px.
   * @param offset - offset in px
   * @param from - start index (default: current active index)
   */
  public abstract move(offset: number, from?: number): void;
  /**
   * Normalizes move offset to the "nearest stable" slide position.
   * @param offset - offset in px
   * @param from - start index (default: current active index)
   */
  public abstract commit(offset?: number, from?: number): void;

  /** Sets active slides from passed index **/
  public setActive(current: number, event?: Partial<ESLCarouselSlideEventInit>): void {
    const related = this.$carousel.activeIndex;
    const indexesBefore = this.$carousel.activeIndexes;
    const count = Math.min(this.count, this.size);
    const indexesAfter = [];

    for (let i = 0; i < this.size; i++) {
      const position = normalize(i + current, this.size);
      const $slide = this.$slides[position];
      if (i < count) indexesAfter.push(position);

      $slide.toggleAttribute('active', i < count);
      $slide.toggleAttribute('pre-active', false);
      $slide.toggleAttribute('next', i === count && (this.loop || position !== 0));
      $slide.toggleAttribute('prev', i === this.size - 1 && i >= count && (this.loop || position !== this.size - 1));
    }

    if (event && typeof event === 'object') {
      const direction = event.direction || indexToDirection(related, this.$carousel.state);
      const details = {...event, direction, indexesBefore, indexesAfter};
      this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', details));
    }
  }

  public setPreActive(from: number, force = true): void {
    const count = Math.min(this.count, this.size);
    for (let i = 0; i < this.size; ++i) {
      const $slide = this.$slides[normalize(i + from, this.size)];
      $slide.toggleAttribute('pre-active', force && i < count);
    }
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
    if (!view || !view.is) throw Error('[ESL]: CarouselRendererRegistry: incorrect registration request');
    if (this.store.has(view.is)) throw Error(`View with name ${view.is} already defined`);
    this.store.set(view.is, view);
    const detail = {name: view.is, view};
    const event = new CustomEvent('change', {detail});
    this.dispatchEvent(event);
  }
}
