import {ExportNs} from '../../../esl-utils/environment/export-ns';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {attr, listen} from '../../../esl-utils/decorators';
import {ARROW_LEFT, ARROW_RIGHT} from '../../../esl-utils/dom/keys';

/**
 * Slide Carousel keyboard support
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Keyboard')
export class ESLCarouselKeyboardMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-keyboard';

  /** Prefix to request next/prev navigation */
  @attr({defaultValue: 'slide'}) public type: 'slide' | 'group';

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (ARROW_LEFT === event.key) {
      this.$host.goTo(`${this.type}:prev`);
    }
    if (ARROW_RIGHT === event.key) {
      this.$host.goTo(`${this.type}:next`);
    }
  }
}

declare global {
  export interface ESLCarouselNS {
    Keyboard: typeof ESLCarouselKeyboardMixin;
  }
}
