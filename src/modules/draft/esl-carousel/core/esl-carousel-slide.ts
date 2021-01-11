/**
 * Slide controller
 * @author Julia Murashko
 */
import {ESLBaseElement} from '../../../esl-base-element/core';

export class ESLCarouselSlide extends ESLBaseElement {
  // TODO: refactor (check type of Element)
  public get index(): number {
    if (!this.parentNode) return -1;
    return Array.prototype.indexOf.call(this.parentNode.children, this);
  }

  public get active(): boolean {
    return this.hasAttribute('active');
  }
  public _setActive(active: boolean) {
    this.toggleAttribute('active', active);
  }

  public get first(): boolean {
    return this.hasAttribute('first');
  }
  public _setFirst(first: boolean) {
    this.toggleAttribute('first', first);
  }
}

export default ESLCarouselSlide;
