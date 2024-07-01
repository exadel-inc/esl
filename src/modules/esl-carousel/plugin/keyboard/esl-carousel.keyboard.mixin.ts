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

  /** @returns key code for next navigation */
  protected get nextKey(): string {
    return this.$host.config.vertical ? ARROW_DOWN : ARROW_RIGHT;
  }
  /** @returns key code for prev navigation */
  protected get prevKey(): string {
    return this.$host.config.vertical ? ARROW_UP : ARROW_LEFT;
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (!this.$host || this.$host.animating) return;
    if (event.key === this.nextKey) this.$host.goTo(`${this.type || 'slide'}:next`);
    if (event.key === this.prevKey) this.$host.goTo(`${this.type || 'slide'}:prev`);
  }
}

declare global {
  export interface ESLCarouselNS {
    Keyboard: typeof ESLCarouselKeyboardMixin;
  }
}
