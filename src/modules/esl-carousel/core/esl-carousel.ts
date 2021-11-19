import './esl-carousel.views';

import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {deepCompare} from '../../esl-utils/misc/object';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLMediaRuleList} from '../../esl-media-query/core';

import {ESLCarouselSlide} from './esl-carousel-slide';
import {ESLCarouselViewRegistry} from './view/esl-carousel-view';

import type {ESLCarouselView} from './view/esl-carousel-view';
import type {ESLCarouselPlugin} from '../plugin/esl-carousel-plugin';


interface CarouselConfig { // Registry
  view?: string;
  count?: number;
  className?: string;
}

export type CarouselDirection = 'next' | 'prev';

/**
 * ESL Carousel component
 * @author Julia Murashko
 **/
@ExportNs('Carousel')
export class ESLCarousel extends ESLBaseElement {
  public static is = 'esl-carousel';
  public static Slide = ESLCarouselSlide;

  static get observedAttributes() {
    return ['config'];
  }

  @attr() public config: string;

  private _configRules: ESLMediaRuleList<CarouselConfig | null>;
  private _currentConfig: CarouselConfig = {};
  private _view: ESLCarouselView | null;
  private readonly _plugins = new Map<string, ESLCarouselPlugin>();

  get activeIndexes(): number[] {
    return this.$slides.reduce((activeIndexes: number[], el, index) => {
      if (el.active) {
        activeIndexes.push(index);
      }
      return activeIndexes;
    }, []);
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    // TODO: change observed attributes
    if (attrName === 'config') {
      this.configRules = ESLMediaRuleList.parse<CarouselConfig>(this.config, ESLMediaRuleList.OBJECT_PARSER);
      this.update(true);
    }
  }

  protected _bindEvents() {
    this.addEventListener('click', this._onClick, false);
  }

  protected _unbindEvents() {
    this.removeEventListener('click', this._onClick, false);
  }

  get configRules() {
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

  private update(force: boolean = false) {
    const config: CarouselConfig = Object.assign(
      {view: 'multiple', count: 1},
      this.configRules.activeValue
    );

    if (!force && deepCompare(this.activeConfig, config)) {
      return;
    }
    this.activeConfig = config;

    const viewType = this.activeConfig.view;
    if (!viewType) return;

    // TODO: somehow compare active view & selected view
    // this._view && this._view.unbind();
    this._view = ESLCarouselViewRegistry.instance.createViewInstance(viewType, this);
    // this._view && this._view.bind();

    if (force || this.activeIndexes.length !== this.activeConfig.count) {
      this._view && this._view.draw();
      // this.goTo(this.firstIndex, '', true);
    }
  }

  private getNextGroup(shiftGroupsCount: number) {
    // get number of group of current active slides by last index of this group
    const lastIndex = this.activeIndexes.length - 1;
    const currentGroup = Math.floor(this.activeIndexes[lastIndex] / this.activeCount);
    // get count of groups of slides
    const countGroups = Math.ceil(this.count / this.activeCount);
    // get number of group of next active slides
    return (currentGroup + shiftGroupsCount + countGroups) % countGroups;
  }

  // move to core plugin
  protected _onClick(event: MouseEvent) {
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
  protected _onMatchChange() {
    this.update();
  }
  @bind
  protected _onRegistryChange() {
    if (!this._view) this.update(true);
  }

  // Plugin management
  public addPlugin(plugin: ESLCarouselPlugin) {
    if (plugin.carousel) return;
    this.appendChild(plugin);
  }

  public removePlugin(plugin: ESLCarouselPlugin | string | undefined) {
    if (typeof plugin === 'string') plugin = this._plugins.get(plugin);
    if (!plugin || plugin.carousel !== this) return;
    plugin.parentNode && plugin.parentNode.removeChild(plugin);
  }

  public _addPlugin(plugin: ESLCarouselPlugin) {
    if (this._plugins.has(plugin.key)) return;
    this._plugins.set(plugin.key, plugin);
    if (this.isConnected) plugin.bind();
  }

  public _removePlugin(plugin: ESLCarouselPlugin) {
    if (!this._plugins.has(plugin.key)) return;
    plugin.unbind();
    this._plugins.delete(plugin.key);
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.update(true);
    this.goTo(this.firstIndex, 'next', true);
    this._bindEvents();

    ESLCarouselViewRegistry.instance.addListener(this._onRegistryChange);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this._unbindEvents();

    ESLCarouselViewRegistry.instance.removeListener(this._onRegistryChange);
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

  public get $activeSlide() {
    const actives = this.$slides.filter((el) => el.active);
    if (actives.length === 0) return null;
    if (actives.length === this.$slides.length) return this.$slides[0];

    // TODO try to make the same as activeSlides
    for (const slide of actives) {
      const prevIndex = this.normalizeIndex(slide.index - 1);
      if (!this.$slides[prevIndex].active) return slide;
    }
  }

  public get $activeSlides() {
    let $slide = this.$activeSlide;
    let i = this.count;
    const arr: ESLCarouselSlide[] = [];
    while ($slide?.active && i > 0) {
      arr.push($slide);
      $slide = this.getNextSlide($slide);
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
  public async goTo(nextIndex: number, direction?: CarouselDirection, force: boolean = false) {
    // TODO: ?
    if (this.dataset.isAnimated) return;

    const {firstIndex} = this;

    nextIndex = this.normalizeIndex(nextIndex);

    if (firstIndex === nextIndex && !force) return;

    direction = direction || this.getDirection(firstIndex, nextIndex);

    // TODO: change info
    const eventDetails = {
      detail: {direction}
    };

    if (!this.$$fire('slide:change', eventDetails)) return;

    if (this._view && firstIndex !== nextIndex) {
      await this._view.onBeforeAnimate();
      await this._view.onAnimate(nextIndex, direction);
      await this._view.onAfterAnimate();
    }

    this.$slides.forEach((el) => el._setActive(false));
    for (let i = 0; i < this.activeCount; i++) {
      this.slideAt(nextIndex + i)._setActive(true);
    }

    this.$$fire('slide:changed', eventDetails);
  }

  public goPrev(count: number = this.activeCount) {
    return this.goTo(this.firstIndex - count, 'prev');
  }
  public goNext(count: number = this.activeCount) {
    return this.goTo(this.firstIndex + count, 'next');
  }

  // TODO utils or private notation
  public normalizeIndex(index: number) {
    return (index + this.count) % this.count;
  }

  public slideAt(index: number) {
    return this.$slides[this.normalizeIndex(index)];
  }

  public getPrevSlide(slide: number | ESLCarouselSlide) {
    if (typeof slide !== 'number') slide = slide.index;
    return this.slideAt(slide - 1);
  }

  public getNextSlide(slide: number | ESLCarouselSlide) {
    if (typeof slide !== 'number') slide = slide.index;
    return this.slideAt(slide + 1);
  }

  public getDirection(from: number, to: number) {
    const abs = Math.abs(from - to);
    if (to > from) {
      return abs > (this.count - abs) % this.count ? 'prev' : 'next';
    } else {
      return abs < (this.count - abs) % this.count ? 'prev' : 'next';
    }
  }

  public static register(tagName?: string) {
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
