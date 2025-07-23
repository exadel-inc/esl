import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {throttle} from '../../../esl-utils/async/throttle';
import {isElement} from '../../../esl-utils/dom/api';
import {bind, decorate, listen} from '../../../esl-utils/decorators';
import {ESLWheelEvent, ESLWheelTarget} from '../../../esl-event-listener/core';

import {direction} from '../../core/esl-carousel.utils';
import {ESLCarouselPlugin} from '../esl-carousel.plugin';

export interface ESLCarouselWheelConfig {
  /** Prefix to request next/prev navigation */
  type: 'slide' | 'group' | 'move' | 'none';
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
  public static override readonly DEFAULT_CONFIG_KEY = 'type';
  public static override readonly DEFAULT_CONFIG: ESLCarouselWheelConfig = {
    type: 'slide',
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
    this.$$on(this._onLongWheel);
    this.$$on(this._onWheel);
  }

  /** @returns true if the plugin should track passed event */
  @bind
  protected isEventIgnored(e: WheelEvent): boolean {
    if (e.shiftKey === this.isVertical) return true;
    if (!isElement(e.target)) return false;
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
    }),
    condition: (plugin: ESLCarouselWheelMixin) => ['slide', 'group'].includes(plugin.config.type)
  })
  @decorate(throttle, 400)
  protected _onLongWheel(e: ESLWheelEvent): void {
    if (!this.$host || this.$host.animating) return;
    const delta = this.isVertical ? e.deltaY : e.deltaX;
    if (!delta) return;
    this.$host?.goTo(`${this.config.type}:${direction(delta)}`, {activator: this}).catch(console.debug);
  }

  /** Handles auxiliary events to move the carousel */
  @listen({
    event: 'wheel',
    passive: false,
    condition: (plugin: ESLCarouselWheelMixin) => plugin.config.type === 'move'
  })
  protected _onWheel(e: WheelEvent): void {
    if (!this.$host || this.$host.animating || this.isEventIgnored(e)) return;
    const delta = ESLWheelTarget.normalizeDelta(e, this.isVertical);
    if (!delta) return; // Ignore zero delta
    // Prevent default action if configured
    if (this.config.preventDefault) e.preventDefault();
    this.$host?.move(this.$host.offset + delta, this.$host.activeIndex, {activator: this});
  }
}

declare global {
  export interface ESLCarouselNS {
    Wheel: typeof ESLCarouselWheelMixin;
  }
}
