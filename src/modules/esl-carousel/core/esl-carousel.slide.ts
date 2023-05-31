import {ESLBaseElement} from '../../esl-base-element/core';
import {boolAttr, memoize} from '../../esl-utils/decorators';
import {findNext, findPrev, findNextLooped, findPrevLooped} from '../../esl-utils/dom/traversing';

import type {ESLCarousel} from './esl-carousel';

/**
 * ESLCarouselSlide component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarouselSlide - a component that provides content for ESLCarousel {@link ESLCarousel}
 */
export class ESLCarouselSlide extends ESLBaseElement {
  /** @returns if the slide is active */
  @boolAttr() public active: boolean;

  @memoize()
  public get $carousel(): ESLCarousel | undefined {
    const carouselTag = this.baseTagName.replace('-slide', '');
    return this.closest(carouselTag) as ESLCarousel | undefined;
  }

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.$carousel?.addSlide && this.$carousel.addSlide(this);
    this.updateA11y();
  }

  protected override disconnectedCallback(): void {
    this.$carousel?.removeSlide && this.$carousel.removeSlide(this);
    memoize.clear(this, '$carousel');
    super.disconnectedCallback();
  }

  /** @returns index of the slide in the carousel. */
  public get index(): number {
    if (!this.parentNode) return NaN;
    return Array.prototype.indexOf.call(this.parentNode.children, this);
  }

  /** @returns next slide sibling. */
  public get $next(): ESLCarouselSlide {
    return findNext(this, (this.constructor as typeof ESLCarouselSlide).is) as ESLCarouselSlide;
  }
  /** @returns prev slide sibling. */
  public get $prev(): ESLCarouselSlide {
    return findPrev(this, (this.constructor as typeof ESLCarouselSlide).is) as ESLCarouselSlide;
  }

  /** @returns next slide sibling (uses cyclic find). */
  public get $nextCyclic(): ESLCarouselSlide {
    return findNextLooped(this, (this.constructor as typeof ESLCarouselSlide).is) as ESLCarouselSlide;
  }
  /** @returns previous slide sibling (uses cyclic find). */
  public get $prevCyclic(): ESLCarouselSlide {
    return findPrevLooped(this, (this.constructor as typeof ESLCarouselSlide).is) as ESLCarouselSlide;
  }

  protected updateA11y(): void {
    this.setAttribute('role', 'group');
    if (!this.hasAttribute('aria-roledescription')) {
      this.setAttribute('aria-roledescription', 'slide');
    }
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', `carousel item ${this.index + 1}`);
    }
  }
}
