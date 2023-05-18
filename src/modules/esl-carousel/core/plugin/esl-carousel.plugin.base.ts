import type {ESLCarousel} from '../esl-carousel';
import type {ESLBaseComponent} from '../../../esl-utils/abstract/component';

export interface ESLCarouselPlugin extends ESLBaseComponent{
  readonly carousel: ESLCarousel;

  /**
   * Define the plugin bind lifecycle hook.
   * Unlike {@link connectedCallback}, bind is called by owner ESL Carousel when the plugin can be attached.
   */
  bind(): void;

  /**
   * Define the plugin unbind lifecycle hook.
   * Unlike {@link disconnectedCallback}, unbind is called by owner ESL Carousel when the plugin should be detached.
   */
  unbind(): void;
}
