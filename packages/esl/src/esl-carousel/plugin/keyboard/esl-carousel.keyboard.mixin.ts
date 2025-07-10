import {ExportNs} from '../../../esl-utils/environment/export-ns';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';
import {listen} from '../../../esl-utils/decorators';
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP} from '../../../esl-utils/dom/keys';

export interface ESLCarouselKeyboardConfig {
  /** Prefix for command to request next/prev navigation */
  command: 'slide' | 'group' | 'none';
}

/**
 * {@link ESLCarousel} Keyboard arrow support
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Keyboard')
export class ESLCarouselKeyboardMixin extends ESLCarouselPlugin<ESLCarouselKeyboardConfig> {
  public static override is = 'esl-carousel-keyboard';
  public static override DEFAULT_CONFIG_KEY = 'command';

  /** @returns key code for next navigation */
  protected get nextKey(): string {
    return this.$host.config.vertical ? ARROW_DOWN : ARROW_RIGHT;
  }
  /** @returns key code for prev navigation */
  protected get prevKey(): string {
    return this.$host.config.vertical ? ARROW_UP : ARROW_LEFT;
  }

  /** @returns result command for carousel */
  protected getCommandFromKey(key: string): string {
    const {command} = this.config;
    if (command === 'none') return '';
    if (key === this.nextKey) return `${command || 'slide'}:next`;
    if (key === this.prevKey) return `${command || 'slide'}:prev`;
    return '';
  }

  /** Handles `keydown` event */
  @listen('keydown')
  protected _onKeydown(event: KeyboardEvent): void {
    if (!this.$host || this.$host.animating) return;
    const command = this.getCommandFromKey(event.key);
    command && this.$host.goTo(command, {activator: this}).catch(console.debug);
  }
}

declare global {
  export interface ESLCarouselNS {
    Keyboard: typeof ESLCarouselKeyboardMixin;
  }
}
