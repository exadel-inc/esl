import {isEqual} from '../../esl-utils/misc/object';
import {parseTime} from '../../esl-utils/misc/format';
import {promisifyTimeout} from '../../esl-utils/async/promise/timeout';
import {ESLCarouselDirection} from './esl-carousel.types';
import {ESLCarouselMoveEvent, ESLCarouselSlideEvent} from './esl-carousel.events';
import {ESLCarouselNavRejection} from './esl-carousel.errors';
import {normalize, normalizeIndex, sequence} from './esl-carousel.utils';
import {ESLCarouselRendererRegistry} from './esl-carousel.renderer.registry';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselActionParams, ESLCarouselConfig, ESLCarouselState, ESLCarouselNavInfo} from './esl-carousel.types';

export abstract class ESLCarouselRenderer implements ESLCarouselConfig, ESLCarouselState {
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

  /** @returns slides shift size in pixels */
  public get offset(): number {
    return 0;
  }

  /** @returns active slide index or -1 if the renderer is not bound */
  public get activeIndex(): number {
    if (this.size <= 0) return -1;
    if (this.$carousel.isActive(0)) {
      for (let i = this.size - 1; i > 0; --i) {
        if (!this.$carousel.isActive(i)) return normalize(i + 1, this.size);
      }
    }
    return this.$slides.findIndex(this.$carousel.isActive, this.$carousel);
  }

  /** @returns list of active slide indexes */
  public get activeIndexes(): number[] {
    const start = this.activeIndex;
    if (start < 0) return [];
    const indexes = [];
    for (let i = 0; i < this.size; i++) {
      const index = normalize(i + start, this.size);
      if (this.$carousel.isActive(index)) indexes.push(index);
    }
    return indexes;
  }

  /** @returns renderer config safe copy */
  public get config(): ESLCarouselConfig {
    const {type, size, count, loop, vertical} = this;
    return {type, size, count, loop, vertical};
  }

  /** @returns renderer state safe copy */
  public get state(): ESLCarouselState {
    const {size, count, loop, vertical, activeIndex, offset} = this;
    return {size, count, loop, vertical, activeIndex, offset};
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
    return this._bound && isEqual(this.config, config);
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
    if (index === this.activeIndex && !this.offset) return; // skip if index is already active
    if (!this.dispatchChangeEvent('BEFORE', index, {...params, direction})) return;

    try {
      this.transitionDuration = params.stepDuration;
      await this.onBeforeAnimate(index, direction, params);
      await this.onAnimate(index, direction, params);
      await this.onAfterAnimate(index, direction, params);
    } catch (e: unknown) {
      if (e instanceof Error) throw e;
    } finally {
      this.transitionDuration = null;
    }
  }

  /** Pre-processing animation action. */
  public async onBeforeAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    if (this.animating) throw new ESLCarouselNavRejection(index);
    this.setPreActive(index, {...params, direction, final: true});
  }

  /** Processes animation. */
  public abstract onAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void>;

  /** Post-processing animation action. */
  public async onAfterAnimate(index: number, direction: ESLCarouselDirection, params: ESLCarouselActionParams): Promise<void> {
    this.setActive(index, {...params, direction});
  }

  /** Moves slide by the passed offset in px */
  public abstract move(offset: number, from: number, params: ESLCarouselActionParams): void;
  /** Normalizes move offset to the "nearest stable" slide position */
  public abstract commit(params: ESLCarouselActionParams): Promise<void>;

  /** Sets active slides from passed index **/
  public setActive(index: number, event?: ESLCarouselActionParams): void {
    const count = Math.min(this.count, this.size);

    for (let i = 0; i < this.size; i++) {
      const position = normalize(i + index, this.size);
      const $slide = this.$slides[position];

      $slide.toggleAttribute('active', i < count);
      $slide.toggleAttribute('pre-active', false);
      $slide.toggleAttribute('next', i === count && (this.loop || position !== 0));
      $slide.toggleAttribute('prev', i === this.size - 1 && i >= count && (this.loop || position !== this.size - 1));
    }

    event && this.dispatchChangeEvent('AFTER', index, {...event});
  }

  /** Sets pre-active (slides that are going to be active) slides from the passed index **/
  public setPreActive(index: number, event?: ESLCarouselActionParams, final = false): void {
    let changed = false;
    const count = Math.min(this.count, this.size);

    for (let i = 0; i < this.size; ++i) {
      const position = normalize(i + index, this.size);
      const $slide = this.$slides[position];

      if ($slide.hasAttribute('active')) continue; // skip already active slides
      changed = changed || ($slide.hasAttribute('pre-active') !== (i < count));
      $slide.toggleAttribute('pre-active', i < count);
    }

    if (event && changed) this.dispatchChangeEvent('CHANGE', index, event);
  }

  /** Dispatches a change event with the given type and index */
  protected dispatchChangeEvent(
    name: 'BEFORE' | 'CHANGE' | 'AFTER',
    index: number,
    event: ESLCarouselActionParams
  ): boolean {
    const count = Math.min(this.count, this.size);
    const indexesAfter = sequence(index, count, this.size);
    const details = {...event, indexesAfter};
    return this.$carousel.dispatchEvent(ESLCarouselSlideEvent.create(name, details));
  }

  /** Dispatches a move event with the given offset, index, delta and event details */
  protected dispatchMoveEvent(
    offsetBefore: number,
    event: ESLCarouselActionParams
  ): void {
    const offset = this.offset;
    if (Math.floor(offset - offsetBefore) === 0) return; // skip if offset is not changed
    const indexesAfter = this.activeIndexes;
    const details = {...event, offset, offsetBefore, indexesAfter};
    this.$carousel.dispatchEvent(ESLCarouselMoveEvent.create(details));
  }

  // Register API
  public static register(view: typeof ESLCarouselRenderer = this): void {
    ESLCarouselRendererRegistry.instance.register(view);
  }
}
