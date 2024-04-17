import {ESLBaseElement} from '../../esl-base-element/core';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {microtask} from '../../esl-utils/async/microtask';
import {attr, boolAttr, decorate, memoize, ready} from '../../esl-utils/decorators';
import {findNext, findPrev, findNextLooped, findPrevLooped} from '../../esl-utils/dom/traversing';

import type {ESLCarousel} from './esl-carousel';

/**
 * ESLCarouselSlide component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarouselSlide - a component that provides content for ESLCarousel {@link ESLCarousel}
 */
export class ESLCarouselSlide extends ESLBaseElement {
  public static observedAttributes = ['active'];

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
    const carouselTag = this.baseTagName.replace('-slide', '');
    return this.closest(carouselTag) as ESLCarousel | undefined;
  }

  @ready
  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$carousel?.addSlide && this.$carousel.addSlide(this);
    this.updateA11y();
    this.updateActiveState();
  }

  protected override disconnectedCallback(): void {
    this.$carousel?.removeSlide && this.$carousel.removeSlide(this);
    memoize.clear(this, '$carousel');
    super.disconnectedCallback();
  }

  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'active') this.updateActiveState();
  }

  /** @returns slide index. */
  public get index(): number {
    if (!this.parentNode) return NaN;
    return Array.prototype.indexOf.call(this.parentNode.children, this);
  }

  /** @returns next slide sibling. */
  public get $next(): ESLCarouselSlide {
    return findNext(this, this.baseTagName) as ESLCarouselSlide;
  }
  /** @returns prev slide sibling. */
  public get $prev(): ESLCarouselSlide {
    return findPrev(this, this.baseTagName) as ESLCarouselSlide;
  }

  /** @returns next slide sibling (uses cyclic find). */
  public get $nextCyclic(): ESLCarouselSlide {
    return findNextLooped(this, this.baseTagName) as ESLCarouselSlide;
  }
  /** @returns previous slide sibling (uses cyclic find). */
  public get $prevCyclic(): ESLCarouselSlide {
    return findPrevLooped(this, this.baseTagName) as ESLCarouselSlide;
  }

  /** Updates initial A11y attributes */
  protected updateA11y(): void {
    this.$$attr('role', 'listitem');
    if (!this.hasAttribute('aria-roledescription')) {
      this.$$attr('aria-roledescription', 'slide');
    }
    if (!this.hasAttribute('aria-label')) {
      this.$$attr('aria-label', `carousel item ${this.index + 1}`);
    }
  }
  /** Updates A11y attributes related to active state */
  protected updateActiveState(): void {
    this.$$attr('aria-hidden', String(!this.active));
    if (!this.$carousel?.hasAttribute(ESLCarouselSlide.NO_INERT_MARKER)) {
      this.toggleAttribute('inert', !this.active);
    }
    if (!this.$carousel) return;
    CSSClassUtils.toggle(this.$carousel.$container || this.$carousel, this.containerClass, this.active, this);
    if (!this.active) this.blurIfInactive();
  }

  @decorate(microtask)
  protected blurIfInactive(): void {
    if (this.active || !this.contains(document.activeElement)) return;
    this.$carousel?.focus({preventScroll: true});
  }

  /** Creates slide element, uses passed content as slide inner */
  public static override create(content?: HTMLElement | DocumentFragment): ESLCarouselSlide {
    const $slide = super.create() as ESLCarouselSlide;
    if (content) $slide.appendChild(content);
    return $slide;
  }
}
