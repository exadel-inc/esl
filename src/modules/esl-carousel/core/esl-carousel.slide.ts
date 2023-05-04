import {boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {findNext, findPrev, findNextLooped, findPrevLooped} from '../../esl-utils/dom/traversing';

/**
 * ESLCarouselSlide component
 * @author Julia Murashko, Alexey Stsefanovich (ala'n)
 *
 * ESLCarouselSlide - a component that provides content for ESLCarousel {@link ESLCarousel}
 */
export class ESLCarouselSlide extends ESLBaseElement {
  /** @returns if the slide is active */
  @boolAttr() public active: boolean;

  protected override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'group');
    this.setAttribute('aria-label', `slide ${this.index + 1}`);
  }

  /** @returns index of the slide in the carousel. */
  public get index(): number {
    if (!this.parentNode) return -1;
    // TODO: refactor (check type of Element)
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
}
