import {ESLMixinElement} from '../../../esl-mixin-element/core';
import {attr, memoize} from '../../../esl-utils/decorators';
import {ESLTraversingQuery} from '../../../esl-traversing-query/core/esl-traversing-query';

import {ESLCarousel} from '../esl-carousel';
import type {ESLCarouselPlugin} from './esl-carousel.plugin.base';

/**
 * {@link ESLCarousel} Plugin base class.
 * The ESL Carousel Plugin should have the dom representation so it's extends {@link ESLBaseElement}
 * Use the attributes to path the plugin options, the same as with any custom elements.
 */
export abstract class ESLCarouselPluginMixin extends ESLMixinElement implements ESLCarouselPlugin {
  // TODO: waits for ESLMixin optimization
  // public static override observedAttributes = ['target'];

  /** {@link TraversingQuery} to find target carousel instance */
  @attr({
    defaultValue: '::parent([esl-carousel-container])::find(esl-carousel)'
  })
  public target: string;

  /** @returns owner carousel of plugin */
  @memoize()
  public get carousel(): ESLCarousel {
    return ESLTraversingQuery.first(this.target, this.$host) as ESLCarousel;
  }

  public override connectedCallback(): void {
    memoize.clear(this, 'carousel');
    if (!this.carousel) return;
    this.carousel.plugins.add(this);
    super.connectedCallback();
    this.bind();
  }
  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (!this.carousel) return;
    this.unbind();
    this.carousel.plugins.delete(this);
    memoize.clear(this, 'carousel');
  }
  public override attributeChangedCallback(attrName: string): void {
    if (attrName === 'target') {
      this.unbind();
      memoize.clear(this, 'carousel');
      this.bind();
    }
  }

  public abstract bind(): void;
  public abstract unbind(): void;

  public static override register(tagName?: string): void {
    ESLCarousel.registered.then(() => super.register.call(this, tagName));
  }
}
