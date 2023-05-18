import {ESLBaseElement} from '../../../esl-base-element/core';
import {attr, memoize} from '../../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core/esl-traversing-query';

import {ESLCarousel} from '../esl-carousel';
import type {ESLCarouselPlugin} from './esl-carousel.plugin.base';

/**
 * {@link ESLCarousel} Plugin base class.
 * The ESL Carousel Plugin should have the dom representation so it's extends {@link ESLBaseElement}
 * Use the attributes to path the plugin options, the same as with any custom elements.
 */
export abstract class ESLCarouselPluginElement extends ESLBaseElement implements ESLCarouselPlugin {
  public static observedAttributes = ['target'];

  /** {@link TraversingQuery} to find target carousel instance */
  @attr({defaultValue: '::parent(esl-carousel)'})
  public target: string;

  /** @returns owner carousel of plugin */
  @memoize()
  public get carousel(): ESLCarousel {
    return ESLTraversingQuery.first(this.target, this) as ESLCarousel;
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
  protected override attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
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
