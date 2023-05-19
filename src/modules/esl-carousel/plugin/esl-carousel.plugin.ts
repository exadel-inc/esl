import {ESLMixinElement} from '../../esl-mixin-element/ui/esl-mixin-element';
import {ESLCarousel} from '../core/esl-carousel';

export abstract class ESLCarouselPlugin extends ESLMixinElement {
  /** Carousel target */
  public override $host: ESLCarousel;

  protected override connectedCallback(): boolean | void {
    const {$host} = this;
    if (($host as unknown) instanceof ESLCarousel) {
      super.connectedCallback();
      return true;
    } else {
      const {is} = this.constructor as typeof ESLCarouselPlugin;
      console.error('[ESL]: %o is not correct target for %o', $host, is);
      this.$host.removeAttribute(is);
      return false;
    }
  }

  public static override register(): void {
    ESLCarousel.registered.then(() => super.register());
  }
}
