import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {throttle} from '../../../esl-utils/async/throttle';
import {attr, decorate, listen} from '../../../esl-utils/decorators';
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

  /** Handles auxiliary events to pause/resume timer */
  @listen({
    event: ESLWheelEvent.type,
    target: (plugin: ESLCarouselWheelMixin) => ESLWheelTarget.for(plugin.$host, {distance: 1})
  })
  @decorate(throttle, 400)
  protected _onWheel(e: ESLWheelEvent): void {
    if (!this.$host || this.$host.animating) return;
    const direction = e.deltaY > 0 ? 'next' : 'prev';
    this.$host?.goTo(`${this.type || 'slide'}:${direction}`);
  }
}

declare global {
  export interface ESLCarouselNS {
    Wheel: typeof ESLCarouselWheelMixin;
  }
}
