import {attr, ESLBaseElement} from '../../esl-base-element/core';
import {memoize} from '../../esl-utils/decorators/memoize';
import {ESLTraversingQuery} from '../../esl-traversing-query/core/esl-traversing-query';

import {ESLCarousel} from './esl-carousel';

/**
 * {@link ESLCarousel} Plugin base class.
 * The ESL Carousel Plugin should have the dom representation so it's extends {@link ESLBaseElement}
 * Use the attributes to path the plugin options, the same as with any custom elements.
 */
export abstract class ESLCarouselPlugin extends ESLBaseElement {
  public static observedAttributes = ['target'];
  public static DEFAULT_TARGET = '::parent(esl-carousel)';

  /** {@link TraversingQuery} to find target carousel instance */
  @attr() public target: string;

  /** @returns owner carousel of plugin */
  @memoize()
  public get carousel(): ESLCarousel {
    const sel = this.target || (this.constructor as typeof ESLCarouselPlugin).DEFAULT_TARGET;
    return ESLTraversingQuery.first(sel, this) as ESLCarousel;
  }

  protected override connectedCallback(): void {
    memoize.clear(this, 'carousel');
    if (!this.carousel) return;
    this.carousel.plugins.add(this);
    super.connectedCallback();
    this.bind();
  }
  protected override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!this.carousel) return;
    this.unbind();
    this.carousel.plugins.delete(this);
    memoize.clear(this, 'carousel');
  }
  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (attrName === 'target' && this.isConnected) {
      this.unbind();
      memoize.clear(this, 'carousel');
      this.bind();
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

  public static override register(tagName?: string): void {
    ESLCarousel.registered.then(() => super.register.call(this, tagName));
  }
}
