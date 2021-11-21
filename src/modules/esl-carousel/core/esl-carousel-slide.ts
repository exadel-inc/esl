import {boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {createSequenceFinder, findNext, findPrev} from '../../esl-utils/dom/traversing';


const findNextSlideLooped =
  createSequenceFinder((el) => el.nextElementSibling || (el.parentElement && el.parentElement.firstElementChild));
const findPrevSlideLooped =
  createSequenceFinder((el) => el.previousElementSibling || (el.parentElement && el.parentElement.lastElementChild));

/**
 * Carousel Slide (Item) component
 * @author Julia Murashko
 */
export class ESLCarouselSlide extends ESLBaseElement {
  /** @returns if the slide is active */
  @boolAttr() public active: boolean;

  /** @returns index of the slide in the carousel */
  public get index(): number {
    if (!this.parentNode) return -1;
    // TODO: refactor (check type of Element)
    return Array.prototype.indexOf.call(this.parentNode.children, this);
  }

  /** @returns next slide sibling */
  public get $next() {
    return findNext(this, (this.constructor as typeof ESLCarouselSlide).is);
  }
  /** @returns prev slide sibling */
  public get $prev() {
    return findPrev(this, (this.constructor as typeof ESLCarouselSlide).is);
  }

  /** @returns next slide sibling (uses cyclic find) */
  public get $nextCyclic() {
    return findNextSlideLooped(this, (this.constructor as typeof ESLCarouselSlide).is);
  }
  /** @returns previous slide sibling (uses cyclic find)  */
  public get $prevCyclic() {
    return findPrevSlideLooped(this, (this.constructor as typeof ESLCarouselSlide).is);
  }
}
