import {ESLBaseElement} from '../../../esl-base-element/core';
import {ESLCarousel} from '../core/esl-carousel';

/**
 * {@link ESLCarousel} Plugin base class.
 * The ESL Carousel Plugin should have the dom representation so it's extends {@link ESLBaseElement}
 * Use the attributes to path the plugin options, the same as with any custom elements.
 */
export abstract class ESLCarouselPlugin extends ESLBaseElement {
  /**
   * Marker to define the restriction for the plugin placement.
   * If freePlacement is false - plugin element should be child of ESLCarousel element.
   * If freePlacement is true - plugin can be placed anywhere inside of carousel.
   */
  public static freePlacement = false;

  /**
   * @returns carousel owner of the plugin
   */
  protected findCarouselOwner(): ESLCarousel | null {
    if ((this.constructor as typeof ESLCarouselPlugin).freePlacement) {
      return this.closest(ESLCarousel.is);
    } else {
      return this.parentNode as ESLCarousel;
    }
  }

  private _carousel?: ESLCarousel;

  /**
   * @returns plugin unique key, ESLCarousel can not own more then one plugin with the same key
   */
  public get key() {
    return this.nodeName.toLowerCase();
  }
  /**
   * @returns owner of plugin
   */
  public get carousel(): ESLCarousel {
    return this._carousel!;
  }

  protected override connectedCallback() {
    const carousel = this.findCarouselOwner();
    if (carousel instanceof ESLCarousel) {
      this._carousel = carousel;
      this._carousel._addPlugin(this);
    } else {
      throw new Error('Invalid esl-carousel-plugin placement: plugin element should be placed under the esl-carousel node');
    }
  }
  protected override disconnectedCallback() {
    if (this.carousel) {
      this.carousel._removePlugin(this);
      delete this._carousel;
    }
  }

  /**
   * Define the plugin bind lifecycle hook.
   * Unlike {@link connectedCallback}, bind is called by owner ESL Carousel when the plugin can be attached.
   */
  public abstract bind(): void;

  /**
   * Define the plugin unbind lifecycle hook.
   * Unlike {@link disconnectedCallback}, unbind is called by owner ESL Carousel when the plugin should be detached.
   */
  public abstract unbind(): void;

  public static override register(tagName?: string) {
    customElements.whenDefined(ESLCarousel.is).then(() => super.register.call(this, tagName));
  }
}
