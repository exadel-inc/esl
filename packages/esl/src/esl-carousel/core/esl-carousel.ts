import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, ready, decorate, listen, memoize} from '../../esl-utils/decorators';
import {isMatches} from '../../esl-utils/dom/traversing';
import {microtask} from '../../esl-utils/async';
import {parseBoolean, parseTime, sequentialUID, toCamelCase} from '../../esl-utils/misc';

import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ESLTraversingQuery} from '../../esl-traversing-query/core';
import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';

import {normalize, toIndex, canNavigate} from './esl-carousel.utils';

import {ESLCarouselSlide} from './esl-carousel.slide';
import {ESLCarouselChangeEvent} from './esl-carousel.events';
import {ESLCarouselRendererRegistry} from './esl-carousel.renderer.registry';

import type {ESLCarouselRenderer} from './esl-carousel.renderer';
import type {
  ESLCarouselState,
  ESLCarouselSlideTarget,
  ESLCarouselStaticState,
  ESLCarouselConfig,
  ESLCarouselActionParams
} from './esl-carousel.types';

/**
 * ESLCarousel component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarousel - a slideshow component for cycling through slides.
 */
@ExportNs('Carousel')
export class ESLCarousel extends ESLBaseElement {
  public static override is = 'esl-carousel';
  public static observedAttributes = ['media', 'type', 'loop', 'count', 'vertical', 'step-duration', 'container'];

  /** Media query pattern used for {@link ESLMediaRuleList} of `type`, `loop` and `count` (default: `all`) */
  @attr({defaultValue: 'all'}) public media: string;
  /** Renderer type name (`multi` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'default'}) public type: string;
  /** Marker to enable loop mode for a carousel (`true` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'false'}) public loop: string | boolean;
  /** Count of slides to show on the screen (`1` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: '1'}) public count: string | number;
  /** Orientation of the carousel (`horizontal` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({defaultValue: 'false'}) public vertical: string | boolean;

  /** Duration of the single slide transition */
  @attr() public stepDuration: string;

  /** Container selector (supports traversing query). Carousel itself by default */
  @attr({defaultValue: ''}) public container: string;
  /** CSS class to add on the container when carousel is empty */
  @attr({defaultValue: ''}) public containerEmptyClass: string;
  /** CSS class to add on the container when carousel is incomplete */
  @attr({defaultValue: ''}) public containerIncompleteClass: string;

  /** true if carousel is in process of animating */
  @boolAttr({readonly: true}) public animating: boolean;
  /** true if carousel is empty */
  @boolAttr({readonly: true}) public empty: boolean;
  /** true if carousel has only one item */
  @boolAttr({readonly: true}) public singleSlide: boolean;
  /** true if carousel is incomplete (total slides count is less or equal to visible slides count) */
  @boolAttr({readonly: true}) public incomplete: boolean;

  /** Marker/mixin attribute to define slide element */
  public get slideAttrName(): string {
    return this.tagName + '-slide';
  }

  /** Renderer type {@link ESLMediaRuleList} instance */
  @memoize()
  public get typeRule(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.type, this.media);
  }
  /** Loop marker {@link ESLMediaRuleList} instance */
  @memoize()
  public get loopRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.loop as string, this.media, parseBoolean);
  }
  /** Count of visible slides {@link ESLMediaRuleList} instance */
  @memoize()
  public get countRule(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.count as string, this.media, parseInt);
  }
  /** Orientation of the carousel {@link ESLMediaRuleList} instance */
  @memoize()
  public get verticalRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.vertical as string, this.media, parseBoolean);
  }
  /** Duration of the single slide transition {@link ESLMediaRuleList} instance */
  @memoize()
  public get stepDurationRule(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.stepDuration, this.media, parseTime);
  }

  /** Returns observed media rules */
  public get observedRules(): ESLMediaRuleList[] {
    return [this.typeRule, this.loopRule, this.countRule, this.verticalRule];
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
    return this.renderer.state;
  }

  /** @returns currently active renderer */
  @memoize()
  public get renderer(): ESLCarouselRenderer {
    return ESLCarouselRendererRegistry.instance.create(this, this.configCurrent);
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.update();
    this.updateA11y();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    if (attrName === 'container') {
      memoize.clear(this, '$container');
      return this.updateStateMarkers();
    }
    memoize.clear(this, `${toCamelCase(attrName)}Rule`);
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
    const initial = !this.renderer.bound;
    const $oldSlides = initial ? [] : this.$slides;

    memoize.clear(this, '$slides');
    const added = this.$slides.filter((slide) => !$oldSlides.includes(slide));
    const removed = $oldSlides.filter((slide) => !this.$slides.includes(slide));

    if (!added.length && !removed.length && this.renderer.equal(config)) return;

    this.renderer.unbind();
    memoize.clear(this, 'renderer');
    this.renderer.bind();

    this.updateStateMarkers();
    this.dispatchEvent(ESLCarouselChangeEvent.create({initial, added, removed, config, oldConfig}));
  }

  protected updateStateMarkers(): void {
    this.$$attr('empty', !this.size);
    this.$$attr('single-slide', this.size === 1);
    this.$$attr('incomplete', this.size <= this.renderer.count);

    if (!this.$container) return;
    CSSClassUtils.toggle(this.$container, this.containerEmptyClass, this.empty, this);
    CSSClassUtils.toggle(this.$container, this.containerIncompleteClass, this.incomplete, this);
  }

  /** Appends slide instance to the current carousel */
  public addSlide(slide: HTMLElement): void {
    slide.setAttribute(this.slideAttrName, '');
    if (slide.parentNode === this.$slidesArea) return this.update();
    console.debug('[ESL]: ESLCarousel moves slide to correct location', slide);
    this.$slidesArea.appendChild(slide);
  }

  /** Remove slide instance from the current carousel */
  public removeSlide(slide: HTMLElement): void {
    if (slide.parentNode === this.$slidesArea) this.$slidesArea.removeChild(slide);
    if (this.$slides.includes(slide)) this.update();
  }

  protected updateA11y(): void {
    if (!this.role) {
      this.setAttribute('role', 'region');
      this.setAttribute('aria-roledescription', 'Carousel');
    }
    if (!this.id) this.id = sequentialUID('esl-carousel-');
    if (!this.$slidesArea.id) this.$slidesArea.id = `${this.id}-slides`;
    if (!this.$slidesArea.role) this.$slidesArea.role = 'list';
  }

  @listen({event: 'change', target: ($this: ESLCarousel) => $this.observedRules})
  protected _onRuleUpdate(): void {
    this.update();
  }

  @listen({event: 'change', target: ESLCarouselRendererRegistry.instance})
  protected _onRegistryUpdate(): void {
    this.update();
  }

  @listen({event: 'resize', target: ESLResizeObserverTarget.for})
  protected _onResize(): void {
    this.renderer && this.renderer.redraw();
  }

  @listen('esl:show:request')
  protected onShowRequest(e: CustomEvent): void {
    const detail = e.detail || {};
    if (!isMatches(this, detail.match)) return;
    const index = this.$slides.findIndex(($slide) => $slide.contains(e.target as Element));
    if (index !== -1 && !this.isActive(index)) this.goTo(index).catch(console.debug);
  }

  /** @returns slides that are processed by the current carousel. */
  @memoize()
  public get $slides(): HTMLElement[] {
    const {slideAttrName} = this;
    const els = this.$slidesArea ? [...this.$slidesArea.children] as HTMLElement[] : [];
    return els.filter((el) => el.hasAttribute(slideAttrName));
  }

  /**
   * @returns carousel container
   */
  @memoize()
  public get $container(): Element | null {
    return ESLTraversingQuery.first(this.container, this) as HTMLElement;
  }

  /** @returns carousel slides area */
  @memoize()
  public get $slidesArea(): HTMLElement {
    const $provided = this.querySelector(`[${this.tagName}-slides]`);
    if ($provided) return $provided as HTMLElement;
    const $container = document.createElement('div');
    $container.setAttribute(this.tagName + '-slides', '');
    this.appendChild($container);
    return $container;
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

  /** @returns additional shift of the stage in pixels */
  public get offset(): number {
    return this.renderer.offset || 0;
  }

  /** @returns index of first (the most left in the loop) active slide */
  public get activeIndex(): number {
    return this.renderer.activeIndex;
  }

  /** @returns list of active slide indexes. */
  public get activeIndexes(): number[] {
    return this.renderer.activeIndexes;
  }

  /** Goes to the target according to passed params */
  public async goTo(target: HTMLElement | ESLCarouselSlideTarget, params: Partial<ESLCarouselActionParams> = {}): Promise<void> {
    if (target instanceof HTMLElement) return this.goTo(this.indexOf(target), params);
    if (!this.renderer) throw new Error('Renderer is not available');
    const index = toIndex(target, this.renderer);
    if (isNaN(index.index)) throw new Error(`Invalid target index passed ${target}`);
    return this.renderer.navigate(index, this.mergeParams(params));
  }

  /** Moves slides by the passed offset */
  public move(offset: number, from: number = this.activeIndex, params: Partial<ESLCarouselActionParams> = {}): void {
    if (!this.renderer) return;
    this.renderer.move(offset, from, this.mergeParams(params));
  }

  /** Commits slides to the nearest stable position */
  public commit(params: Partial<ESLCarouselActionParams> = {}): Promise<void> {
    if (!this.renderer) return Promise.reject();
    return this.renderer.commit(this.mergeParams(params));
  }

  /** Merges request params with default params */
  protected mergeParams(params: Partial<ESLCarouselActionParams>): ESLCarouselActionParams {
    const stepDuration = this.stepDurationRule.value || 0;
    return {stepDuration, ...params};
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
    return canNavigate(target, this.renderer);
  }

  /** @returns if the passed element (or slide on a passed index) is an active slide */
  public isActive(el: number | HTMLElement): boolean {
    if (typeof el === 'number') return this.isActive(this.$slides[el]);
    return el && el.hasAttribute('active');
  }
  /** @returns if the passed element (or slide on a passed index) is a slide in pre-active state */
  public isPreActive(el: number | HTMLElement): boolean {
    if (typeof el === 'number') return this.isPreActive(this.$slides[el]);
    return el && el.hasAttribute('pre-active');
  }
  /** @returns if the passed element (or slide on a passed index) is a next slide */
  public isNext(el: number | HTMLElement): boolean {
    if (typeof el === 'number') return this.isNext(this.$slides[el]);
    return el && el.hasAttribute('next');
  }
  /** @returns if the passed element (or slide on a passed index) is a prev slide */
  public isPrev(el: number | HTMLElement): boolean {
    if (typeof el === 'number') return this.isPrev(this.$slides[el]);
    return el && el.hasAttribute('prev');
  }

  /**
   * Registers component in the {@link customElements} registry
   * @param tagName - custom tag name to register custom element
   */
  public static override register(tagName?: string): void {
    super.register(tagName);
    ESLCarouselSlide.is = this.is + '-slide';
    ESLCarouselSlide.register();
  }
}

declare global {
  export interface ESLCarouselNS {
  }

  export interface ESLLibrary {
    Carousel: typeof ESLCarousel & ESLCarouselNS;
  }

  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
  }
}
