import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {throttle} from '../../../esl-utils/async/throttle';
import {bind, decorate, listen} from '../../../esl-utils/decorators';
import {ESLWheelEvent, ESLWheelTarget} from '../../../esl-event-listener/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

export interface ESLCarouselWheelConfig {
  /** Prefix to request next/prev navigation */
  command: 'slide' | 'group';
  /** CSS selector to ignore wheel event from */
  ignore: string;
  /**
   * Restricts wheel direction.
   * Values:
   * - 'auto' - depends on the carousel orientation (default)
   * - 'x' - horizontal only
   * - 'y' - vertical only
   */
  direction: string;
  /** Prevent default action for wheel event */
  preventDefault: boolean;
}

/**
 * {@link ESLCarousel} wheel control plugin mixin
 * Switch slides by mouse wheel
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Wheel')
export class ESLCarouselWheelMixin extends ESLCarouselPlugin<ESLCarouselWheelConfig> {
  public static override is = 'esl-carousel-wheel';
  public static override readonly DEFAULT_CONFIG_KEY = 'command';
  public static override readonly DEFAULT_CONFIG: ESLCarouselWheelConfig = {
    command: 'slide',
    ignore: '[contenteditable]',
    direction: 'auto',
    preventDefault: true
  };

  /** @returns true if the plugin should track vertical wheel */
  protected get isVertical(): boolean {
    switch (this.config.direction) {
      case 'x': return false;
      case 'y': return true;
      default: return this.$host.state.vertical;
    }
  }

  /** Resubscribes according new config */
  @listen({inherit: true})
  protected override onConfigChange(): void {
    super.onConfigChange();
    this.$$on(this._onWheel);
  }

  /** @returns true if the plugin should track passed event */
  @bind
  protected isEventIgnored(e: WheelEvent & {target: Element}): boolean {
    if (e.shiftKey === this.isVertical) return true;
    const {ignore} = this.config;
    return !!ignore && !!e.target.closest(ignore);
  }

  /** Handles auxiliary events to pause/resume timer */
  @listen({
    event: ESLWheelEvent.TYPE,
    target: (plugin: ESLCarouselWheelMixin) => ESLWheelTarget.for(plugin.$host, {
      distance: 10,
      preventDefault: plugin.config.preventDefault,
      ignore: plugin.isEventIgnored
    })
  })
  @decorate(throttle, 400)
  protected _onWheel(e: ESLWheelEvent): void {
    if (!this.$host || this.$host.animating) return;
    const delta = this.isVertical ? e.deltaY : e.deltaX;
    const direction = delta > 0 ? 'next' : 'prev';
    this.$host?.goTo(`${this.config.command || 'slide'}:${direction}`);
  }
}

declare global {
  export interface ESLCarouselNS {
    Wheel: typeof ESLCarouselWheelMixin;
  }
}
