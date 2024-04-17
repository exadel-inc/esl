import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, ready, decorate, listen, memoize} from '../../esl-utils/decorators';

import {microtask} from '../../esl-utils/async';
import {parseBoolean} from '../../esl-utils/misc';

import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';

import {normalize, toIndex, canNavigate} from './nav/esl-carousel.nav.utils';

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
 * ESLCarousel - a slideshow component for cycling through slides.
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
  public addSlide(slide: HTMLElement): void {
    if (!slide) return;
    if (!ESLCarouselSlide.isSlide(slide)) slide.setAttribute(ESLCarouselSlide.is, '');
    if (slide.parentNode !== this.$slidesArea) {
      slide.remove();
      this.$slidesArea?.appendChild(slide);
    }
    this.update();
  }

  /** Remove slide instance from the current carousel */
  public removeSlide(slide: HTMLElement): void {
    if (!slide) return;
    if (!ESLCarouselSlide.isSlide(slide)) return this.removeSlide(slide.closest(`[${ESLCarouselSlide.is}]`)!);
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
  public get $slides(): HTMLElement[] {
    const els = this.$slidesArea ? [...this.$slidesArea.children] as HTMLElement[] : [];
    return els.filter(ESLCarouselSlide.isSlide, ESLCarouselSlide);
  }

  /** @returns carousel container */
  @memoize()
  public get $container(): HTMLElement | null {
    return this.closest(`[${this.tagName}-container]`);
  }

  /** @returns carousel slides area */
  @memoize()
  public get $slidesArea(): HTMLElement {
    const $provided = this.querySelector('[esl-carousel-slides]');
    if ($provided) return $provided as HTMLElement;
    const $container = document.createElement('div');
    $container.setAttribute('esl-carousel-slides', '');
    this.appendChild($container);
    return $container ;
  }

  /** @returns first active slide */
  public get $activeSlide(): HTMLElement | undefined {
    return this.$slides[this.activeIndex];
  }

  /** @returns list of active slides. */
  public get $activeSlides(): HTMLElement[] {
    return this.activeIndexes.map((index) => this.$slides[index]);
  }

  /** @returns count of slides. */
  public get size(): number {
    return this.$slides.length || 0;
  }

  /** @returns index of first (the most left in the loop) active slide */
  public get activeIndex(): number {
    if (this.size <= 0) return -1;
    if (this.$slides[0].hasAttribute('active')) {
      for (let i = this.size - 1; i > 0; --i) {
        if (!this.$slides[i].hasAttribute('active')) return normalize(i + 1, this.size);
      }
    }
    return this.$slides.findIndex((slide) => slide.hasAttribute('active'));
  }

  /** @returns list of active slide indexes. */
  public get activeIndexes(): number[] {
    const start = this.activeIndex;
    if (start < 0) return [];
    const indexes = [];
    for (let i = 0; i < this.size; i++) {
      const index = normalize(i + start, this.size);
      if (this.$slides[index].hasAttribute('active')) indexes.push(index);
    }
    return indexes;
  }

  /** Goes to the target according to passed params */
  public goTo(target: ESLCarouselSlideTarget, params: ESLCarouselActionParams = {}): void {
    if (!this.renderer) return;
    const {index, dir} = toIndex(target, this.state);
    const direction = params.direction || dir || 'next';
    this.renderer.navigate(index, direction, params);
  }

  /** @returns slide by index (supports not normalized indexes) */
  public slideAt(index: number): HTMLElement {
    return this.$slides[normalize(index, this.$slides.length)];
  }

  /** @returns index of the passed slide */
  public indexOf(slide: HTMLElement): number {
    return this.$slides.indexOf(slide);
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
    ESLCarouselSlide.register();
    super.register(tagName);
  }
}

declare global {
  export interface ESLCarouselNS {}
  export interface ESLLibrary {
    Carousel: typeof ESLCarousel & ESLCarouselNS;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
  }
}
