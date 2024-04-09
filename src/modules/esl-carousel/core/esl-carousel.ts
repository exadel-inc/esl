import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, ready, decorate, listen, memoize} from '../../esl-utils/decorators';

import {microtask} from '../../esl-utils/async';
import {parseBoolean} from '../../esl-utils/misc';

import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';

import {normalizeIndex, toIndex, canNavigate} from './nav/esl-carousel.nav.utils';

import {ESLCarouselSlide} from './esl-carousel.slide';
import {ESLCarouselRenderer} from './esl-carousel.renderer';
import {ESLCarouselChangeEvent} from './esl-carousel.events';

import type {ESLCarouselState, ESLCarouselDirection, ESLCarouselSlideTarget, ESLCarouselStaticState, ESLCarouselConfig} from './nav/esl-carousel.nav.types';

/** {@link ESLCarousel} action params interface */
export interface ESLCarouselActionParams {
  /** Element requester of the change */
  activator?: any;
  /** Direction to move to. */
  direction?: ESLCarouselDirection;
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
export class ESLCarousel extends ESLBaseElement {
  public static override is = 'esl-carousel';
  public static observedAttributes = ['media', 'type', 'loop', 'count', 'vertical'];

  /** Media query pattern used for {@link ESLMediaRuleList} of `type`, `loop` and `count` (default: `all`) */
  @attr({defaultValue: 'all'}) public media: string;
  /** Renderer type name (`multi` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'default'}) public type: string;
  /** Marker to enable loop mode for a carousel (`true` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'false'}) public loop: string;
  /** Count of slides to show on the screen (`1` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: '1'}) public count: string;
  /** Orientation of the carousel (`horizontal` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'false'}) public vertical: string;

  /** true if carousel is in process of animating */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Renderer type {@link ESLMediaRuleList} instance */
  @memoize()
  public get typeRule(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.media, this.type);
  }
  /** Loop marker {@link ESLMediaRuleList} instance */
  @memoize()
  public get loopRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.media, this.loop, parseBoolean);
  }
  /** Count of visible slides {@link ESLMediaRuleList} instance */
  @memoize()
  public get countRule(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.media, this.count, parseInt);
  }
  /** Orientation of the carousel {@link ESLMediaRuleList} instance */
  @memoize()
  public get verticalRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.media, this.vertical, parseBoolean);
  }

  /** Carousel instance current {@link ESLCarouselStaticState} */
  public get config(): ESLCarouselStaticState {
    return this.renderer.config;
  }

  /** Carousel instance configured {@link ESLCarouselStaticState} */
  public get configCurrent(): ESLCarouselConfig {
    return {
      type: this.typeRule.value || 'default',
      size: this.$slides.length,
      count: this.countRule.value || 1,
      loop: !!this.loopRule.value,
      vertical: !!this.verticalRule.value
    };
  }

  /** Carousel instance current {@link ESLCarouselState} */
  public get state(): ESLCarouselState {
    return Object.assign({}, this.renderer.config, {
      activeIndex: this.activeIndex
    });
  }

  /** @returns currently active renderer */
  @memoize()
  public get renderer(): ESLCarouselRenderer {
    return ESLCarouselRenderer.registry.create(this, this.configCurrent);
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.update();
    this.updateA11y();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    memoize.clear(this, `${attrName}Rule`);
    this.update();
  }

  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    memoize.clear(this, ['$container', '$slides', '$slidesArea', 'typeRule', 'loopRule', 'countRule', 'verticalRule']);
  }

  /** Updates the config and the state that is associated with */
  @decorate(microtask)
  public update(): void {
    const config = this.configCurrent;
    const oldConfig = this.config;
    const $oldSlides = this.$slides;

    memoize.clear(this, '$slides');
    const added = this.$slides.filter((slide) => !$oldSlides.includes(slide));
    const removed = $oldSlides.filter((slide) => !this.$slides.includes(slide));

    if (!added.length && !removed.length && this.renderer.equal(config)) return;

    this.renderer.unbind();
    memoize.clear(this, 'renderer');
    this.renderer && this.renderer.bind();
    this.updateContainer();
    this.dispatchEvent(ESLCarouselChangeEvent.create({added, removed, config, oldConfig}));
  }

  public updateContainer(): void {
    if (!this.$container) return;
    this.$container.toggleAttribute('empty', this.size === 0);
    this.$container.toggleAttribute('single', this.size === 1);
    this.$container.toggleAttribute('incomplete', this.size <= this.renderer.count);
  }

  /** Appends slide instance to the current carousel */
  public addSlide(slide: HTMLElement | ESLCarouselSlide): void {
    if (!slide) return;
    if (!(slide instanceof ESLCarouselSlide)) return this.addSlide(ESLCarouselSlide.create(slide));
    if (slide.parentNode !== this.$slidesArea) {
      slide.remove();
      this.$slidesArea?.appendChild(slide);
    }
    this.update();
  }

  /** Remove slide instance from the current carousel */
  public removeSlide(slide: HTMLElement | ESLCarouselSlide): void {
    if (!slide) return;
    if (!(slide instanceof ESLCarouselSlide)) return this.removeSlide(slide.closest(ESLCarouselSlide.is)!);
    if (slide.parentNode === this.$slidesArea) this.$slidesArea?.removeChild(slide);
    this.update();
  }

  protected updateA11y(): void {
    const $container = this.$container || this;
    if (!$container.hasAttribute('role')) {
      $container.setAttribute('role', 'region');
      $container.setAttribute('aria-roledescription', 'Carousel');
    }
    if (!this.$slidesArea.hasAttribute('role')) {
      this.$slidesArea.setAttribute('role', 'list');
      // this.$slidesArea.setAttribute('aria-live', 'polite');
    }
  }

  @listen({
    event: 'change',
    target: ({typeRule, countRule, loopRule}: ESLCarousel) => [typeRule, countRule, loopRule]
  })
  protected _onRuleUpdate(): void {
    this.update();
  }

  @listen({event: 'change', target: ESLCarouselRenderer.registry})
  protected _onRegistryUpdate(): void {
    this.update();
  }

  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected _onResize(): void {
    this.renderer && this.renderer.redraw();
  }

  /** @returns slides that are processed by the current carousel. */
  @memoize()
  public get $slides(): ESLCarouselSlide[] {
    const els = this.$slidesArea ? [...this.$slidesArea.children] : [];
    return els.filter((slide): slide is ESLCarouselSlide  => slide.matches(ESLCarouselSlide.is));
  }

  /** @returns carousel container */
  @memoize()
  public get $container(): HTMLElement | null {
    return this.closest(`[${ESLCarousel.is}-container]`);
  }

  /** @returns carousel slides area */
  @memoize()
  public get $slidesArea(): HTMLElement {
    const $provided = this.querySelector('[data-slides-area]');
    if ($provided) return $provided as HTMLElement;
    const $container = document.createElement('div');
    $container.setAttribute('data-slides-area', '');
    this.appendChild($container);
    return $container ;
  }

  /** @returns first active slide */
  public get $activeSlide(): ESLCarouselSlide | null {
    const actives = this.$slides.filter((el) => el.active);
    if (actives.length === 0) return null;
    if (actives.length === this.$slides.length) return this.$slides[0];

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
  public get activeIndex(): number {
    return this.$activeSlide?.index || 0;
  }
  /** @returns list of active slide indexes. */
  public get activeIndexes(): number[] {
    return this.$slides.reduce((activeIndexes: number[], el, index) => {
      if (el.active) activeIndexes.push(index);
      return activeIndexes;
    }, []);
  }

  /** Goes to the target according to passed params */
  public goTo(target: ESLCarouselSlideTarget, params: ESLCarouselActionParams = {}): void {
    if (!this.renderer) return;
    const {index, dir} = toIndex(target, this.state);
    const direction = params.direction || dir || 'next';
    this.renderer.navigate(index, direction, params);
  }

  /** @returns slide by index (supports not normalized indexes) */
  public slideAt(index: number): ESLCarouselSlide {
    return this.$slides[normalizeIndex(index, this.$slides.length)];
  }

  /** @returns if the passed slide target can be reached */
  public canNavigate(target: ESLCarouselSlideTarget): boolean {
    return canNavigate(target, this.state);
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
