import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {parseBoolean} from '../../esl-utils/misc/format';
import {isEqual} from '../../esl-utils/misc/object/compare';

import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';

import {normalizeIndex, toIndex, canNavigate} from './nav/esl-carousel.nav.utils';

import {ESLCarouselView} from './esl-carousel.view';
import {ESLCarouselSlide} from './esl-carousel.slide';

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
  /** Element requester of the change */
  activator?: any;
  /** Direction to move to. */
  direction?: ESLCarouselDirection;
  /** Force action independently of current state of the Carousel. */
  force?: boolean;
  // TODO: implement
  // noAnimation?: boolean;
}

/**
 * ESLCarousel component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarousel - a slideshow component for cycling through slides {@link ESLCarouselSlide}.
 */
@ExportNs('Carousel')
export class ESLCarousel extends ESLBaseElement implements ESLCarouselState {
  public static override is = 'esl-carousel';
  public static observedAttributes = ['media', 'type', 'loop', 'count'];

  @attr({name: 'media', defaultValue: 'all'}) public mediaCfg: string;
  @attr({name: 'type', defaultValue: 'multi'}) public typeCfg: string;
  @attr({name: 'loop', defaultValue: 'true'}) public loopCfg: string;
  @attr({name: 'count', defaultValue: '1'}) public countCfg: string;

  @boolAttr({readonly: true}) public animating: boolean;

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

  protected _view: ESLCarouselView;

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

  // TODO: check if it works
  /** Updates the config and the state that is associated with. */
  public update(force: boolean = false): void {
    if (!force && this._view && isEqual(this.config, this.activeConfig)) return;
    this._view?.unbind();

    memoize.clear(this, 'config');
    this._view = ESLCarouselView.registry.create(this.config.type, this);
    if (!this._view) return;

    this._view.bind();
    this.goTo(this.firstIndex, {force: true});
  }

  @listen({
    event: 'change',
    target: ({typeRule, countRule, loopRule}: ESLCarousel) => [typeRule, countRule, loopRule]
  })
  protected _onRuleUpdate(): void {
    this.update();
  }

  @listen({
    event: 'change',
    target: ESLCarouselView.registry
  })
  protected _onRegistryUpdate(): void {
    this.update();
  }

  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected _onResize(): void {
    if (!this._view) return;
    this._view.redraw();
    // this.goTo(this.firstIndex); // todo: move to media query
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    memoize.clear(this, `${attrName}Rule`);
    this.update();
  }

  protected override connectedCallback(): void {
    super.connectedCallback();

    this.update(true);

    // TODO: update a11y -> check a11y everywhere
    const ariaLabel = this.hasAttribute('aria-label');
    !ariaLabel && this.setAttribute('aria-label', 'Carousel');
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
  /** @returns list of active slide indexes. */
  public get activeIndexes(): number[] {
    return this.$slides.reduce((activeIndexes: number[], el, index) => {
      if (el.active) activeIndexes.push(index);
      return activeIndexes;
    }, []);
  }

  /** Goes to the target according to passed params. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async goTo(target: ESLCarouselSlideTarget, params: CarouselActionParams = {}): Promise<void> {
    // TODO: go to last action (from console for example) and animate from
    // 1) 1 slide is active, js goTo(2), goTo(3) -> goTo(3)
    // 2) 1 slide is active, js goTo(2), goTo(3), goTo(2) -> goTo(2)
    // 3) 1 slide is active, js goTo(2), setTimeout(goTo(1)) -> goTo(2), the active point -> goTo(1)
    // Task Manager (Toggleable - different types of requests, read DelayedTask)
    if (this.dataset.isAnimated) return;

    const {firstIndex} = this;

    const {index, dir} = toIndex(target, this);
    const direction = params.direction || dir;
    const activator = params.activator;

    if (!direction || firstIndex === index && !params.force) return;

    // TODO: change info
    const eventDetails = {
      detail: {direction, activator},
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

  /** @returns if the passed slide target can be reached */
  public canNavigate(target: ESLCarouselSlideTarget): boolean {
    return canNavigate(target, this);
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
  export interface ESLCarouselNS {}
  export interface ESLLibrary {
    Carousel: typeof ESLCarousel & ESLCarouselNS;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
    'esl-carousel-slide': ESLCarouselSlide;
  }
}
