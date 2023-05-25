import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement} from '../../esl-base-element/core';
import {attr, boolAttr, listen, memoize} from '../../esl-utils/decorators';
import {parseBoolean} from '../../esl-utils/misc/format';

import {ESLMediaRuleList} from '../../esl-media-query/core';
import {ESLResizeObserverTarget} from '../../esl-event-listener/core';

import {normalizeIndex, toIndex, canNavigate} from './nav/esl-carousel.nav.utils';

import {ESLCarouselSlide} from './esl-carousel.slide';
import {ESLCarouselRenderer} from './esl-carousel.renderer';
import {ESLCarouselChangeEvent, ESLCarouselSlideEvent} from './esl-carousel.events';

import type {ESLCarouselState, ESLCarouselDirection, ESLCarouselSlideTarget} from './nav/esl-carousel.nav.types';


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

  /** Media query pattern used for {@link ESLMediaRuleList} of `type`, `loop` and `count` (default: `all`) */
  @attr({name: 'media', defaultValue: 'all'}) public mediaCfg: string;
  /** Renderer type name (`multi` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({name: 'type', defaultValue: 'multi'}) public typeCfg: string;
  /** Marker to enable loop mode for carousel (`true` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({name: 'loop', defaultValue: 'true'}) public loopCfg: string;
  /** Count of slides to show on the screen (`1` by default). Supports {@link ESLMediaRuleList} syntax */
  @attr({name: 'count', defaultValue: '1'}) public countCfg: string;

  /** true if carousel is in process of animating */
  @boolAttr({readonly: true}) public animating: boolean;

  /** Renderer type {@link ESLMediaRuleList} instance */
  @memoize()
  public get typeRule(): ESLMediaRuleList<string> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.typeCfg);
  }
  /** Loop marker {@link ESLMediaRuleList} instance */
  @memoize()
  public get loopRule(): ESLMediaRuleList<boolean> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.loopCfg, parseBoolean);
  }
  /** Count of visible slides {@link ESLMediaRuleList} instance */
  @memoize()
  public get countRule(): ESLMediaRuleList<number> {
    return ESLMediaRuleList.parse(this.mediaCfg, this.countCfg, parseInt);
  }

  /** @returns if the carousel is in a loop mode */
  @memoize()
  public get loop(): boolean {
    return this.loopRule.value || false;
  }
  /** @returns count of active (visible) slides */
  @memoize()
  public get count(): number {
    return this.countRule.value || 1;
  }

  /** @returns currently active renderer */
  @memoize()
  public get renderer(): ESLCarouselRenderer {
    const type = this.typeRule.value || 'multi';
    const renderer = ESLCarouselRenderer.registry.create(type, this);
    renderer && renderer.bind();
    return renderer;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();

    this.update(true);

    // TODO: update a11y -> check a11y everywhere
    const ariaLabel = this.hasAttribute('aria-label');
    !ariaLabel && this.setAttribute('aria-label', 'Carousel');
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected) return;
    memoize.clear(this, `${attrName}Rule`);
    this.update();
  }

  /** Updates the config and the state that is associated with. */
  public update(force: boolean = false): void {
    const cfgChanged = this.count !== this.countRule.value || this.loop !== this.loopRule.value;
    const typeChanged = this.renderer?.type !== this.typeRule.value;

    if (typeChanged) {
      this.renderer && this.renderer.unbind();
      memoize.clear(this, 'renderer');
    }

    if (force || typeChanged || cfgChanged) {
      memoize.clear(this, ['loop', 'count']);
      this.renderer.redraw();

      this.dispatchEvent(ESLCarouselChangeEvent.create({
        prop: 'config'
      }));
    }

    this.goTo(this.activeIndex, {force: true});
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

  /** Goes to the target according to passed params. */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  public async goTo(target: ESLCarouselSlideTarget, params: CarouselActionParams = {}): Promise<void> {
    // TODO: go to last action (from console for example) and animate from
    // 1) 1 slide is active, js goTo(2), goTo(3) -> goTo(3)
    // 2) 1 slide is active, js goTo(2), goTo(3), goTo(2) -> goTo(2)
    // 3) 1 slide is active, js goTo(2), setTimeout(goTo(1)) -> goTo(2), the active point -> goTo(1)
    // Task Manager (Toggleable - different types of requests, read DelayedTask)
    if (!this.renderer || this.dataset.isAnimated) return;

    const {activeIndex} = this;

    const {index, dir} = toIndex(target, this);
    const direction = params.direction || dir;
    const activator = params.activator;

    if (!direction || activeIndex === index && !params.force) return;

    if (!this.dispatchEvent(ESLCarouselSlideEvent.create('BEFORE', {
      direction,
      activator,
      current: index,
      related: activeIndex
    }))) return;

    if (activeIndex !== index) {
      try {
        await this.renderer.onBeforeAnimate(index, direction);
        await this.renderer.onAnimate(index, direction);
        await this.renderer.onAfterAnimate();
      } catch (e: unknown) {
        console.error(e);
      }
    }

    this.renderer.setActive(index);

    this.dispatchEvent(ESLCarouselSlideEvent.create('AFTER', {
      direction,
      activator,
      current: activeIndex,
      related: index
    }));
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
