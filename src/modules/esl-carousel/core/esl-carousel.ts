import './esl-carousel.views';

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {memoize} from '../../esl-utils/decorators/memoize';
import {parseBoolean} from '../../esl-utils/misc/format';
import {ESLMediaRuleList} from '../../esl-media-query/core';

import {isEqual} from '../../esl-utils/misc/object/compare';
import {normalizeIndex, toIndex, toDirection} from './nav/esl-carousel.nav.utils';
import {ESLCarouselSlide} from './esl-carousel.slide';
import {ESLCarouselView} from './view/esl-carousel-view';

import type {ESLCarouselPlugin} from './plugin/esl-carousel.plugin.base';
import type {ESLCarouselState, ESLCarouselDirection, ESLCarouselSlideTarget} from './nav/esl-carousel.nav.types';

/** Config to define behavior of ESLCarousel */
interface CarouselConfig {
  /** Defines carousel rendering view. */
  type: string;
  /** Defines the total number of slides. */
  count: number;
  /** Defines if the carousel is in a loop. */
  loop: boolean;
  /** Class(es) to mark the carousel element. */
  cls?: string;
}

/** {@link ESLCarousel} action params interface */
export interface CarouselActionParams {
  /** Direction to move to. */
  direction?: ESLCarouselDirection;
  /** Force action independently of current state of the Carousel. */
  force?: boolean;
  // TODO: implement
  noAnimation?: boolean;
}

/**
 * ESLCarousel component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarousel - a slideshow component for cycling through slides {@link ESLCarouselSlide}.
 */
@ExportNs('Carousel')
export class ESLCarousel extends ESLBaseElement implements ESLCarouselState {
  public static readonly Slide = ESLCarouselSlide;

  public static override is = 'esl-carousel';
  public static observedAttributes = ['media', 'type', 'loop', 'count'];

  @attr({name: 'media', defaultValue: 'all'}) public mediaCfg: string;
  @attr({name: 'type', defaultValue: 'slide'}) public typeCfg: string;
  @attr({name: 'loop', defaultValue: 'true'}) public loopCfg: string;
  @attr({name: 'count', defaultValue: '1'}) public countCfg: string;

  @memoize()
  public get typeRule(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.typeCfg);
  }
  @memoize()
  public get loopRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.loopCfg, parseBoolean);
  }
  @memoize()
  public get countRule(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.countCfg, parseInt);
  }

  @memoize()
  public get config(): CarouselConfig {
    return this.activeConfig;
  }
  public get activeConfig(): CarouselConfig {
    return {
      type: this.typeRule.value || 'slide',
      loop: this.loopRule.value || false,
      count: this.countRule.value || 1
    };
  }

  public readonly plugins = new Set<ESLCarouselPlugin>();
  protected _view: ESLCarouselView;
  protected _resizeObserver = new ResizeObserver(this._onResize);

  /**  @returns marker if the carousel is in a loop. */
  public get loop(): boolean {
    return this.config.loop;
  }
  /** @returns count of active slides. */
  public get count(): number {
    return this.config.count;
  }

  public get view(): ESLCarouselView {
    return this._view;
  }

  /** Updates the config and the state that is associated with. */
  public update(force: boolean = false): void {
    if (!force && this._view && isEqual(this.config, this.activeConfig)) return;
    this._view?.unbind();

    memoize.clear(this, 'config');
    this._view = ESLCarouselView.registry.create(this.config.type, this);
    if (!this._view) return;

    this._view && this._view.bind();
    this.goTo(this.firstIndex, {force: true});
  }

  @bind
  protected _onUpdate(): void {
    this.update();
  }

  @bind
  protected _onResize(): void {
    if (!this._view) return;
    this._view.redraw();
    this.goTo(this.firstIndex);
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    memoize.clear(this, `${attrName}Rule`);
    this.update();
  }

  protected override connectedCallback(): void {
    super.connectedCallback();

    this.update(true);
    this.goTo(this.firstIndex, {force: true});

    const ariaLabel = this.hasAttribute('aria-label');
    !ariaLabel && this.setAttribute('aria-label', 'Carousel');

    this.bindEvents();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  protected bindEvents(): void {
    ESLCarouselView.registry.addListener(this._onUpdate);
    this.typeRule.addEventListener(this._onUpdate);
    this.countRule.addEventListener(this._onUpdate);
    this.loopRule.addEventListener(this._onUpdate);
    this._resizeObserver.observe(this);
  }

  protected unbindEvents(): void {
    ESLCarouselView.registry.removeListener(this._onUpdate);
    this.typeRule.removeEventListener(this._onUpdate);
    this.countRule.removeEventListener(this._onUpdate);
    this.loopRule.removeEventListener(this._onUpdate);
    this._resizeObserver.unobserve(this);
  }

  /** @returns list of active slide indexes. */
  public get activeIndexes(): number[] {
    return this.$slides.reduce((activeIndexes: number[], el, index) => {
      if (el.active) {
        activeIndexes.push(index);
      }
      return activeIndexes;
    }, []);
  }

  /** @returns slides that are processed by the current carousel. */
  @memoize()
  public get $slides(): ESLCarouselSlide[] {
    const els = this.$slidesArea && this.$slidesArea.querySelectorAll(ESLCarouselSlide.is);
    return els ? Array.from(els) as ESLCarouselSlide[] : [];
  }

  /** @returns slides carousel area. */
  @memoize()
  public get $slidesArea(): HTMLElement | null {
    return this.querySelector('[data-slides-area]');
  }

  // TODO: discuss null
  /** @returns first active slide. */
  public get $activeSlide(): ESLCarouselSlide {
    const actives = this.$slides.filter((el) => el.active);
    // if (actives.length === 0) return null;
    if (actives.length === this.$slides.length) return this.$slides[0];

    // TODO try to make the same as activeSlides
    for (const slide of actives) {
      const prevIndex = normalizeIndex(slide.index - 1, this.size);
      if (!this.$slides[prevIndex].active) return slide;
    }
    return this.$slides[0];
  }

  /** @returns list of active slides. */
  public get $activeSlides(): ESLCarouselSlide[] {
    let $slide = this.$activeSlide;
    let i = this.size;
    const arr: ESLCarouselSlide[] = [];
    while ($slide?.active && i > 0) {
      arr.push($slide);
      $slide = $slide.$nextCyclic;
      i--;
    }
    return arr;
  }

  /** @returns count of slides. */
  public get size(): number {
    return this.$slides.length || 0;
  }

  /** @returns index of first active slide. */
  public get firstIndex(): number {
    return this.$activeSlide?.index || 0;
  }

  /** Goes to the target according to passed params. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async goTo(target: ESLCarouselSlideTarget, params: CarouselActionParams = {}): Promise<void> {
    // TODO: ?
    if (this.dataset.isAnimated) return;

    const {firstIndex} = this;

    const index = toIndex(target, this);
    const direction = params.direction || toDirection(target, index, this);

    if (firstIndex === index && !params.force) return;

    // TODO: change info
    const eventDetails = {
      detail: {direction},
      bubbles: false
    };

    if (!this.$$fire('esl:slide:change', eventDetails)) return;

    if (this._view && firstIndex !== index) {
      try {
        await this._view.onBeforeAnimate(index, direction);
        await this._view.onAnimate(index, direction);
        await this._view.onAfterAnimate();
      } catch (e: unknown) {
        console.error(e);
      }
    }

    this._view.setActive(index);
    this.$$fire('esl:slide:changed', eventDetails);
  }

  /** Gets slide by index. */
  public slideAt(index: number): ESLCarouselSlide {
    return this.$slides[normalizeIndex(index, this.size)];
  }

  /**
   * Registers component in the {@link customElements} registry
   * @param tagName - custom tag name to register custom element
   */
  public static override register(tagName?: string): void {
    ESLCarouselSlide.register((tagName || ESLCarousel.is) + '-slide');
    customElements.whenDefined(ESLCarouselSlide.is).then(() => super.register.call(this, tagName));
  }
}

declare global {
  export interface ESLCarouselPlugins {}
  export interface ESLLibrary {
    Carousel: typeof ESLCarousel;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
    'esl-carousel-slide': ESLCarouselSlide;
  }
}
