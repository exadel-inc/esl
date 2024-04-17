import {ESLMixinElement} from '../../esl-mixin-element/core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {microtask} from '../../esl-utils/async/microtask';
import {attr, boolAttr, decorate, memoize, ready} from '../../esl-utils/decorators';

import type {ESLCarousel} from './esl-carousel';

/**
 * ESLCarouselSlide component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarouselSlide - a component that provides content for ESLCarousel {@link ESLCarousel}
 */
export class ESLCarouselSlide extends ESLMixinElement {
  public static override readonly is = 'esl-carousel-slide';
  public static override observedAttributes = ['active'];

  /** Carousel marker to omit `inert` attribute on slides */
  public static readonly NO_INERT_MARKER = 'no-inert';

  /** @returns if the slide is active */
  @boolAttr() public active: boolean;
  /** @returns if slide is going to be next active */
  @boolAttr() public preActive: boolean;

  /** Slide is next to active slide */
  @boolAttr() public next: boolean;
  /** Slide is previous to active slide */
  @boolAttr() public prev: boolean;

  /** Class(-es) to add on carousel container when slide is active. Supports {@link CSSClassUtils} syntax */
  @attr() public containerClass: string;

  @memoize()
  public get $carousel(): ESLCarousel | undefined {
    const type = this.constructor as typeof ESLCarouselSlide;
    const carouselTag = type.is.replace('-slide', '');
    return this.$host.closest(carouselTag) as ESLCarousel | undefined;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$carousel?.addSlide && this.$carousel.addSlide(this.$host);
    this.updateA11y();
    this.updateActiveState();
  }

  protected override disconnectedCallback(): void {
    this.$carousel?.removeSlide && this.$carousel.removeSlide(this.$host);
    memoize.clear(this, '$carousel');
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'active') this.updateActiveState();
  }

  /** @returns slide index. */
  public get index(): number {
    return this.$carousel?.indexOf(this.$host) || -1;
  }

  /** Updates initial A11y attributes */
  protected updateA11y(): void {
    this.$$attr('role', 'listitem');
    if (!this.$host.hasAttribute('aria-roledescription')) {
      this.$$attr('aria-roledescription', 'slide');
    }
    if (!this.$host.hasAttribute('aria-label')) {
      this.$$attr('aria-label', `carousel item ${this.index + 1}`);
    }
  }
  /** Updates A11y attributes related to active state */
  protected updateActiveState(): void {
    this.$$attr('aria-hidden', String(!this.active));
    if (!this.$carousel?.hasAttribute(ESLCarouselSlide.NO_INERT_MARKER)) {
      this.$$attr('inert', !this.active);
    }
    if (!this.$carousel) return;
    CSSClassUtils.toggle(this.$carousel.$container || this.$carousel, this.containerClass, this.active, this.$host);
    if (!this.active) this.blurIfInactive();
  }

  @decorate(microtask)
  protected blurIfInactive(): void {
    if (this.active || !this.$host.contains(document.activeElement)) return;
    this.$carousel?.focus({preventScroll: true});
  }

  /** @returns whether the element is a slide */
  public static isSlide(el: HTMLElement): boolean {
    return el.hasAttribute(this.is);
  }
  /** @returns whether the slide is active */
  public static isActive(slide: HTMLElement): boolean {
    return slide.hasAttribute('active');
  }
  /** @returns whether the slide is pre-active */
  public static isPreActive(slide: HTMLElement): boolean {
    return slide.hasAttribute('pre-active');
  }
  /** @returns whether the slide is next */
  public static isNext(slide: HTMLElement): boolean {
    return slide.hasAttribute('next');
  }
  /** @returns whether the slide is prev */
  public static isPrev(slide: HTMLElement): boolean {
    return slide.hasAttribute('prev');
  }
}
