import {ExportNs} from '../../../esl-utils/environment/export-ns';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {attr, listen} from '../../../esl-utils/decorators';
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from '../../../esl-utils/dom/keys';

/**
 * {@link ESLCarousel} Keyboard arrow support
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Keyboard')
export class ESLCarouselKeyboardMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-keyboard';

  /** Prefix to request next/prev navigation */
  @attr({name: ESLCarouselKeyboardMixin.is}) public type: 'slide' | 'group';

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if ([ARROW_LEFT, ARROW_UP].includes(event.key)) {
      this.$host.goTo(`${this.type || 'slide'}:prev`);
    }
    if ([ARROW_RIGHT, ARROW_DOWN].includes(event.key)) {
      this.$host.goTo(`${this.type || 'slide'}:next`);
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Keyboard: typeof ESLCarouselKeyboardMixin;
  }
}
