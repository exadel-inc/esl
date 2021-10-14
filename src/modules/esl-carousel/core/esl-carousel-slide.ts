import {ESLBaseElement} from '../../esl-base-element/core';

/**
 * Carousel Slide (Item) component
 * @author Julia Murashko
 */
export class ESLCarouselSlide extends ESLBaseElement {
  /** @returns index of the slide in the carousel */
  public get index(): number {
    if (!this.parentNode) return -1;
    // TODO: refactor (check type of Element)
    return Array.prototype.indexOf.call(this.parentNode.children, this);
  }

  /** @returns if the slide is active */
  public get active(): boolean {
    return this.hasAttribute('active');
  }

  // TODO: rethink approach
  public _setActive(active: boolean) {
    this.toggleAttribute('active', active);
  }
}

declare global {
  export interface HTMLElementTagNameMap {
    'esl-carousel-slide': ESLCarouselSlide;
  }
}
