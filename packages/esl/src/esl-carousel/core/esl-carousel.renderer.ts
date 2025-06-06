import {memoize} from '../../esl-utils/decorators';
import {isEqual} from '../../esl-utils/misc/object';
import {parseTime} from '../../esl-utils/misc/format';
import {promisifyTimeout} from '../../esl-utils/async/promise/timeout';
import {SyntheticEventTarget} from '../../esl-utils/dom';
import {ESLCarouselDirection} from './esl-carousel.types';
import {ESLCarouselSlideEvent} from './esl-carousel.events';
import {indexToDirection, normalize, normalizeIndex, sequence} from './esl-carousel.utils';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselSlideEventInit} from './esl-carousel.events';
import type {ESLCarouselActionParams, ESLCarouselConfig, ESLCarouselNavInfo} from './esl-carousel.types';

export abstract class ESLCarouselRenderer implements ESLCarouselConfig {
  /** CSS variable name to set transition duration */
  public static readonly TRANSITION_DURATION_PROP = '--esl-carousel-step-duration';

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

  protected get animating(): boolean {
    return this.$carousel.hasAttribute('animating');
  }
  protected set animating(value: boolean) {
    this.$carousel.toggleAttribute('animating', value);
  }

  protected get transitionDuration(): number {
    const name = ESLCarouselRenderer.TRANSITION_DURATION_PROP;
    const duration = getComputedStyle(this.$area).getPropertyValue(name);
    return parseTime(duration);
  }
  protected set transitionDuration(value: number | null) {
    if (typeof value === 'number' && value > 0) {
      this.$carousel.style.setProperty(ESLCarouselRenderer.TRANSITION_DURATION_PROP, `${value}ms`);
    } else {
      this.$carousel.style.removeProperty(ESLCarouselRenderer.TRANSITION_DURATION_PROP);
    }
  }
  protected get transitionDuration$$(): Promise<void> {
    return promisifyTimeout(this.transitionDuration);
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
    return (this.loop ? params && params.direction : null) || direction || ESLCarouselDirection.NEXT;
  }

  /** Processes changing slides */
  public async navigate(to: ESLCarouselNavInfo, params: ESLCarouselActionParams): Promise<void> {
    const index = this.normalizeIndex(to.index, params);
    const direction = this.normalizeDirection(to.direction, params);

    const indexesAfter = sequence(index, this.count, this.size);
    const indexesBefore = this.$carousel.activeIndexes;
    if (indexesBefore.toString() === indexesAfter.toString()) return;

    const details = {...params, direction, indexesBefore, indexesAfter};
    if (!this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('BEFORE', details))) return;

    this.setPreActive(index);
    this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create('CHANGE', details));

    this.transitionDuration = params.stepDuration;
    try {
      await this.onBeforeAnimate(index, direction, params);
      await this.onAnimate(index, direction, params);
      await this.onAfterAnimate(index, direction, params);

      this.setActive(index, {direction, ...params});
    } catch (e: unknown) {
      if (e instanceof Error) throw e;
    } finally {
      this.transitionDuration = null;
    }
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {}
  /** Processes animation. */
  public abstract onAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void>;
  /** Post-processing animation action. */
  public async onAfterAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {}

  /** Moves slide by the passed offset in px */
  public abstract move(offset: number, from: number, params: ESLCarouselActionParams): void;
  /** Normalizes move offset to the "nearest stable" slide position */
  public abstract commit(offset: number, from: number, params: ESLCarouselActionParams): Promise<void>;

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
