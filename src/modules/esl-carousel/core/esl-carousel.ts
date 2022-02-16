import './esl-carousel.views';

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {deepCompare} from '../../esl-utils/misc/object';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLMediaRuleList} from '../../esl-media-query/core';

import {normalizeIndex, toIndex, toDirection} from './esl-carousel-utils';
import {ESLCarouselSlide} from './esl-carousel-slide';
import {ESLCarouselView} from './view/esl-carousel-view';

import type {ESLCarouselPlugin} from '../plugin/esl-carousel-plugin';
import type {CarouselDirection, CarouselSlideTarget} from './esl-carousel-utils';

/** Config to define behavior of ESLCarousel */
interface CarouselConfig { // Registry
  /** Defines carousel rendering view. */
  view?: string;
  /** Defines the total number of slides. */
  count?: number;
  /** Defines if the carousel is in a loop. */
  loop?: boolean;
  /** Class(es) to mark the carousel element. */
  cls?: string;
}

/** {@link ESLCarousel} action params interface */
export interface CarouselActionParams {
  /** Direction to move to. */
  direction?: CarouselDirection;
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
export class ESLCarousel extends ESLBaseElement {
  public static is = 'esl-carousel';
  public static Slide = ESLCarouselSlide;

  static get observedAttributes(): string[] {
    return ['config'];
  }

  /** Config for current ESLCarousel instance. */
  @attr() public config: string;

  protected _configRules: ESLMediaRuleList<CarouselConfig | null>;
  protected _currentConfig: CarouselConfig = {};
  protected _view: ESLCarouselView;
  protected readonly _plugins = new Map<string, ESLCarouselPlugin>();

  // TODO: rename
  /**  @returns carousel rendered view. */
  get view(): ESLCarouselView {
    if (!this._view) {
      this.update(true);
    }
    return this._view;
  }

  /**  @returns marker if the carousel is in a loop. */
  get loop(): boolean {
    return this.activeConfig.loop || false;
  }

  /** @returns list of active slide indexes. */
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

  /** Updates the config and the state that is associated with. */
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

    this.goTo(this.firstIndex, {force: true});
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

  /** Handles `click` event. */
  // TODO: focus disappear after click
  protected _onClick(event: MouseEvent): void {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const markedTarget: HTMLElement | null = eventTarget.closest('[data-slide-target]');
    if (markedTarget && markedTarget.dataset.slideTarget) {
      this.goTo(markedTarget.dataset.slideTarget as CarouselSlideTarget);
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
    this.goTo(this.firstIndex, {force: true});
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
      const prevIndex = normalizeIndex(slide.index - 1, this.count);
      if (!this.$slides[prevIndex].active) return slide;
    }
    return this.$slides[0];
  }

  /** @returns list of active slides. */
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

  /** @returns count of slides. */
  public get count(): number {
    return this.$slides.length || 0;
  }

  /** @returns count of active slides. */
  public get activeCount(): number {
    return this.activeConfig.count || 0;
  }

  /** @returns index of first active slide. */
  public get firstIndex(): number {
    return this.$activeSlide?.index || 0;
  }

  /** Goes to the target according to passed params. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async goTo(target: CarouselSlideTarget, params: CarouselActionParams = {}): Promise<void> {
    // TODO: ?
    if (this.dataset.isAnimated) return;

    const {firstIndex} = this;

    const index = toIndex(target, this);
    const direction = params.direction || toDirection(target, index, this);

    if (firstIndex === index && !params.force) return;

    // TODO: change info
    const eventDetails = {
      detail: {direction}
    };

    if (!this.$$fire('slide:change', eventDetails)) return;

    if (this._view && firstIndex !== index) {
      await this._view.onBeforeAnimate(index, direction);
      await this._view.onAnimate(index, direction);
      await this._view.onAfterAnimate();
    }

    // TODO: move to commit method
    this.$slides.forEach((el) => (el.active = false));
    for (let i = 0; i < this.activeCount; i++) {
      this.slideAt(index + i).active = true;
    }
    this.$$fire('slide:changed', eventDetails);
  }

  /** Gets slide by index. */
  public slideAt(index: number): ESLCarouselSlide {
    return this.$slides[normalizeIndex(index, this.count)];
  }

  /**
   * Registers component in the {@link customElements} registry
   * @param tagName - custom tag name to register custom element
   */
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
