import {ESLMixinElement} from '../../esl-mixin-element/ui/esl-mixin-element';
import {ESLCarousel} from '../core/esl-carousel';
import {ready} from '../../esl-utils/decorators/ready';

/** Base mixin plugin of {@link ESLCarousel} */
export abstract class ESLCarouselPlugin extends ESLMixinElement {
  /** {@link ESLCarousel} host instance */
  public override $host: ESLCarousel;

  @ready
  protected override connectedCallback(): boolean | void {
    const {$host} = this;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
      return true;
    } else {
      const {is} = this.constructor as typeof ESLCarouselPlugin;
      console.warn('[ESL]: ESLCarousel %s plugin rejected for non correct target %o', is, $host);
      this.$host.removeAttribute(is);
      return false;
    }
  }

  /** Register mixin-plugin in ESLMixinRegistry */
  public static override register(): void {
    ESLCarousel.registered.then(() => super.register());
  }
}
