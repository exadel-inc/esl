import './esl-carousel.views';

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {deepCompare} from '../../esl-utils/misc/object';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLMediaRuleList} from '../../esl-media-query/core';

import {calcDirection, normalizeIndex} from './esl-carousel-utils';
import {ESLCarouselSlide} from './esl-carousel-slide';
import {ESLCarouselView} from './view/esl-carousel-view';

import type {ESLCarouselPlugin} from '../plugin/esl-carousel-plugin';
import type {CarouselDirection, CarouselSlideTarget} from './esl-carousel-utils';

interface CarouselConfig { // Registry
  view?: string;
  count?: number;
  className?: string;
}

/**
 * ESL Carousel component
 * @author Julia Murashko
 **/
@ExportNs('Carousel')
export class ESLCarousel extends ESLBaseElement {
  public static is = 'esl-carousel';
  public static Slide = ESLCarouselSlide;

  static get observedAttributes(): string[] {
    return ['config'];
  }

  @attr() public config: string;

  protected _configRules: ESLMediaRuleList<CarouselConfig | null>;
  protected _currentConfig: CarouselConfig = {};
  protected _view: ESLCarouselView | null;
  protected readonly _plugins = new Map<string, ESLCarouselPlugin>();

  // TODO: rename
  // TODO: should be not none
  get view(): ESLCarouselView | null {
    return this._view;
  }

  get activeIndexes(): number[] {
    return this.$slides.reduce((activeIndexes: number[], el, index) => {
      if (el.active) {
        activeIndexes.push(index);
      }
      return activeIndexes;
    }, []);
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    // TODO: change observed attributes
    if (attrName === 'config') {
      this.configRules = ESLMediaRuleList.parse<CarouselConfig>(this.config, ESLMediaRuleList.OBJECT_PARSER);
      this.update(true);
    }
  }

  protected _bindEvents(): void {
    this.addEventListener('click', this._onClick, false);
  }

  protected _unbindEvents(): void {
    this.removeEventListener('click', this._onClick, false);
  }

  get configRules(): ESLMediaRuleList<CarouselConfig | null> {
    if (!this._configRules) {
      this.configRules = ESLMediaRuleList.parse<CarouselConfig>(this.config, ESLMediaRuleList.OBJECT_PARSER);
    }
    return this._configRules;
  }

  set configRules(rules: ESLMediaRuleList<CarouselConfig | null>) {
    if (this._configRules) {
      this._configRules.removeListener(this._onMatchChange);
    }
    this._configRules = rules;
    this._configRules.addListener(this._onMatchChange);
  }

  private update(force: boolean = false): void {
    const config: CarouselConfig = Object.assign(
      {view: 'multi', count: 1},
      this.configRules.activeValue
    );

    if (!force && deepCompare(this.activeConfig, config)) {
      return;
    }
    this.activeConfig = config;

    const viewType = this.activeConfig.view;
    if (!viewType) return;

    this._view && this._view.unbind();
    this._view = ESLCarouselView.registry.create(viewType, this);
    this._view && this._view.bind();

    this.goTo(this.firstIndex, 'next', true);
  }

  private getNextGroup(shiftGroupsCount: number): number {
    // get number of group of current active slides by last index of this group
    const lastIndex = this.activeIndexes.length - 1;
    const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.activeCount);
    // get count of groups of slides
    const countGroups = Math.ceil(this.count / this.activeCount);
    // get number of group of next active slides
    return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
  }

  // move to core plugin
  /** Handles `click` event */
  // TODO: focus disappear after click
  protected _onClick(event: MouseEvent): void {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const markedTarget: HTMLElement | null = eventTarget.closest('[data-slide-target]');
    if (markedTarget && markedTarget.dataset.slideTarget) {
      const target = markedTarget.dataset.slideTarget;
      if ('prev' === target) {
        this.goPrev();
      } else if ('next' === target) {
        this.goNext();
      } else if ('g' === target[0]) {
        const group = +(target.substr(1)) - 1;
        const lastGroup = Math.floor(this.count / this.activeCount);
        this.goTo(group === lastGroup ? this.count - this.activeCount : this.activeCount * group);
      } else {
        this.goTo(+target - 1);
      }
    }
  }

  @bind
  protected _onMatchChange(): void {
    this.update();
  }
  @bind
  protected _onRegistryChange(): void {
    if (!this._view) this.update(true);
  }

  // Plugin management
  public addPlugin(plugin: ESLCarouselPlugin): void {
    if (plugin.carousel) return;
    this.appendChild(plugin);
  }

  public removePlugin(plugin: ESLCarouselPlugin | string | undefined): void {
    if (typeof plugin === 'string') plugin = this._plugins.get(plugin);
    if (!plugin || plugin.carousel !== this) return;
    plugin.parentNode && plugin.parentNode.removeChild(plugin);
  }

  public _addPlugin(plugin: ESLCarouselPlugin): void {
    if (this._plugins.has(plugin.key)) return;
    this._plugins.set(plugin.key, plugin);
    if (this.isConnected) plugin.bind();
  }

  public _removePlugin(plugin: ESLCarouselPlugin): void {
    if (!this._plugins.has(plugin.key)) return;
    plugin.unbind();
    this._plugins.delete(plugin.key);
  }

  protected connectedCallback(): void {
    super.connectedCallback();

    this.update(true);
    this.goTo(this.firstIndex, 'next', true);
    this._bindEvents();

    ESLCarouselView.registry.addListener(this._onRegistryChange);
    const ariaLabel = this.hasAttribute('aria-label');
    !ariaLabel && this.setAttribute('aria-label', 'Carousel');
  }

  protected disconnectedCallback(): void {
    super.disconnectedCallback();
    this._unbindEvents();

    ESLCarouselView.registry.removeListener(this._onRegistryChange);
  }

  public get activeConfig(): CarouselConfig {
    return this._currentConfig;
  }
  public set activeConfig(config) {
    this._currentConfig = Object.assign({}, config);
  }

  @memoize()
  public get $slides(): ESLCarouselSlide[] {
    const els = this.$slidesArea && this.$slidesArea.querySelectorAll(ESLCarouselSlide.is);
    return els ? Array.from(els) as ESLCarouselSlide[] : [];
  }

  @memoize()
  public get $slidesArea(): HTMLElement | null {
    return this.querySelector('[data-slides-area]');
  }

  // TODO: discuss null
  public get $activeSlide(): ESLCarouselSlide {
    const actives = this.$slides.filter((el) => el.active);
    // if (actives.length === 0) return null;
    if (actives.length === this.$slides.length) return this.$slides[0];

    // TODO try to make the same as activeSlides
    for (const slide of actives) {
      const prevIndex = normalizeIndex(slide.index - 1, this.count);
      if (!this.$slides[prevIndex].active) return slide;
    }
    return this.$slides[0];
  }

  public get $activeSlides(): ESLCarouselSlide[] {
    let $slide = this.$activeSlide;
    let i = this.count;
    const arr: ESLCarouselSlide[] = [];
    while ($slide?.active && i > 0) {
      arr.push($slide);
      $slide = $slide.$nextCyclic;
      i--;
    }
    return arr;
  }

  public get count(): number {
    return this.$slides.length || 0;
  }

  public get activeCount(): number {
    return this.activeConfig.count || 0;
  }

  public get firstIndex(): number {
    return this.$activeSlide?.index || 0;
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async goTo(nextIndex: number, direction?: CarouselDirection | null, force: boolean = false): Promise<void> {
    // TODO: ?
    if (this.dataset.isAnimated) return;

    const {firstIndex} = this;

    nextIndex = normalizeIndex(nextIndex, this.count);

    if (firstIndex === nextIndex && !force) return;

    direction = direction || calcDirection(firstIndex, nextIndex, this.count);

    // TODO: change info
    const eventDetails = {
      detail: {direction}
    };

    if (!this.$$fire('slide:change', eventDetails)) return;

    if (this._view && firstIndex !== nextIndex) {
      await this._view.onBeforeAnimate(nextIndex, direction);
      await this._view.onAnimate(nextIndex, direction);
      await this._view.onAfterAnimate();
    }

    this.$slides.forEach((el) => (el.active = false));
    for (let i = 0; i < this.activeCount; i++) {
      this.slideAt(nextIndex + i).active = true;
    }

    this.$$fire('slide:changed', eventDetails);
  }

  // TODO: rename
  public goPrev(count: number = this.activeCount): Promise<void> {
    const normalizedIndex = normalizeIndex(this.firstIndex - count, this.count);
    // make the first slide active if the circle is over
    const index = this.firstIndex !== 0 && normalizedIndex >= this.firstIndex ? 0 : normalizedIndex;
    return this.goTo(index, 'prev');
  }
  // TODO: rename
  public goNext(count: number = this.activeCount): Promise<void> {
    const lastIndex = this.firstIndex + count + this.activeCount;
    // make the last slide active if the circle is over
    const index = this.firstIndex + this.activeCount !== this.count && lastIndex > this.count - 1 ?
      this.count - this.activeCount : normalizeIndex(this.firstIndex + count, this.count);
    return this.goTo(index, 'next');
  }

  public slideAt(index: number): ESLCarouselSlide {
    return this.$slides[normalizeIndex(index, this.count)];
  }

  // TODO: 'get'  discuss , created to cover onClick functionality
  public toIndex(target: CarouselSlideTarget): number {
    if ('prev' === target) return normalizeIndex(this.firstIndex - this.activeCount, this.count);
    if ('next' === target) return normalizeIndex(this.firstIndex + this.activeCount, this.count);
    if (typeof target === 'number' || !isNaN(+target)) return normalizeIndex(+target - 1, this.count);
    if ('g' !== target[0]) return this.firstIndex;
    const group = +(target.substring(1)) - 1;
    const lastGroup = Math.floor(this.count / this.activeCount);
    const index = group === lastGroup ? this.count - this.activeCount : this.activeCount * group;
    return normalizeIndex(index, this.count);
  }

  public static register(tagName?: string): void {
    ESLCarouselSlide.register((tagName || ESLCarousel.is) + '-slide');
    customElements.whenDefined(ESLCarouselSlide.is).then(() => super.register.call(this, tagName));
  }
}

declare global {
  export interface ESLCarouselPlugins {}
  export interface ESLLibrary {
    Carousel: typeof ESLCarousel;
    CarouselPlugin: typeof ESLCarouselPlugin;
  }
  export interface HTMLElementTagNameMap {
    'esl-carousel': ESLCarousel;
    'esl-carousel-slide': ESLCarouselSlide;
  }
}
