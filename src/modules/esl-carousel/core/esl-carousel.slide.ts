import {ESLMixinElement} from '../../esl-mixin-element/core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {microtask} from '../../esl-utils/async/microtask';
import {attr, decorate, memoize, ready} from '../../esl-utils/decorators';

import type {ESLCarousel} from './esl-carousel';

/**
 * ESLCarouselSlide component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarouselSlide - a component that provides content for ESLCarousel {@link ESLCarousel}
 */
export class ESLCarouselSlide extends ESLMixinElement {
  public static override is = 'esl-carousel-slide';
  public static override observedAttributes = ['active'];

  /** Carousel marker to omit `inert` attribute on slides */
  public static readonly NO_INERT_MARKER = 'no-inert';

  /** @returns slide index. */
  public get index(): number {
    return this.$carousel!.indexOf(this.$host);
  }
  /** @returns whether the slide is active */
  public get active(): boolean {
    return this.$carousel!.isActive(this.$host);
  }
  /** @returns whether the slide is in pre-active state */
  public get preActive(): boolean {
    return this.$carousel!.isPreActive(this.$host);
  }
  /** @returns whether the slide is next in navigation */
  public get next(): boolean {
    return this.$carousel!.isNext(this.$host);
  }
  /** @returns whether the slide is previous in navigation*/
  public get prev(): boolean {
    return this.$carousel!.isPrev(this.$host);
  }

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
    if (!this.$carousel) return;
    this.$carousel?.addSlide && this.$carousel.addSlide(this.$host);
    super.connectedCallback();
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
}
