import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {throttle} from '../../../esl-utils/async/throttle';
import {parseBoolean} from '../../../esl-utils/misc/format';
import {attr, bind, decorate, listen} from '../../../esl-utils/decorators';
import {ESLWheelEvent, ESLWheelTarget} from '../../../esl-event-listener/core';

import {ESLCarouselPlugin} from '../esl-carousel.plugin';

/**
 * {@link ESLCarousel} wheel control plugin mixin
 * Switch slides by mouse wheel
 *
 * @author Alexey Stsefanovich (ala'n)
 */
@ExportNs('Carousel.Wheel')
export class ESLCarouselWheelMixin extends ESLCarouselPlugin {
  public static override is = 'esl-carousel-wheel';

  /** Prefix to request next/prev navigation */
  @attr({name: ESLCarouselWheelMixin.is}) public type: 'slide' | 'group';

  /** CSS selector to ignore wheel event from */
  @attr({
    name: ESLCarouselWheelMixin.is + '-ignore',
    defaultValue: '[contenteditable]'
  })
  public ignore: string;

  /**
   * Restricts wheel direction.
   * Values:
   * - 'auto' - depends on the carousel orientation (default)
   * - 'x' - horizontal only
   * - 'y' - vertical only
   */
  @attr({name: ESLCarouselWheelMixin.is + '-direction'}) public direction: string;

  /** Prevent default action for wheel event */
  @attr({
    name: ESLCarouselWheelMixin.is + '-prevent-default',
    defaultValue: true,
    parser: parseBoolean
  }) public preventDefault: boolean;

  /** @returns true if the plugin should track vertical wheel */
  protected get isVertical(): boolean {
    if (this.direction === 'x') return false;
    if (this.direction === 'y') return true;
    return this.$host.state.vertical;
  }

  /** @returns true if the plugin should track passed event */
  @bind
  protected isEventIgnored(e: WheelEvent & {target: Element}): boolean {
    if (e.shiftKey === this.isVertical) return true;
    return !!this.ignore && !!e.target.closest(this.ignore);
  }

  /** Handles auxiliary events to pause/resume timer */
  @listen({
    event: ESLWheelEvent.TYPE,
    target: (plugin: ESLCarouselWheelMixin) => ESLWheelTarget.for(plugin.$host, {
      distance: 10,
      preventDefault: plugin.preventDefault,
      ignore: plugin.isEventIgnored
    })
  })
  @decorate(throttle, 400)
  protected _onWheel(e: ESLWheelEvent): void {
    if (!this.$host || this.$host.animating) return;
    const delta = this.isVertical ? e.deltaY : e.deltaX;
    const direction = delta > 0 ? 'next' : 'prev';
    this.$host?.goTo(`${this.type || 'slide'}:${direction}`);
  }
}

declare global {
  export interface ESLCarouselNS {
    Wheel: typeof ESLCarouselWheelMixin;
  }
}
