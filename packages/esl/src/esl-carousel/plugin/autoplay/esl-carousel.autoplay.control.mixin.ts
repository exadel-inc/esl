import {ExportNs} from '../../../esl-utils/environment/export-ns';
import {attr, listen} from '../../../esl-utils/decorators';

import {ESLCarouselAutoplayStateMixin} from './esl-carousel.autoplay.state.mixin';

import type {ESLCarouselAutoplayBehaviour} from './esl-carousel.autoplay.types';

/**
 * External autoplay control mixin.
 * Hosts on a control element and toggles autoplay state for the target carousel.
 */
@ExportNs('Carousel.AutoplayControl')
export class ESLCarouselAutoplayControlMixin extends ESLCarouselAutoplayStateMixin {
  public static override is = 'esl-carousel-autoplay-control';

  /** Control behaviour to apply on click */
  @attr({name: ESLCarouselAutoplayControlMixin.is, defaultValue: 'stop'})
  public behaviour: ESLCarouselAutoplayBehaviour;

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.$$attr('aria-controls', null);
    this.$$attr('aria-pressed', null);
  }

  /** Synchronize control state markers and a11y state */
  protected override syncState(): void {
    super.syncState();
    const {autoplay} = this;
    const pressed = this.behaviour === 'pause' ?
      !!(autoplay?.paused) :
      !!(autoplay?.enabled);

    this.$$attr('aria-controls', this.targetID);
    this.$$attr('aria-pressed', String(pressed));
  }


  /** Handles host click and toggles autoplay using configured behaviour */
  @listen('click')
  protected _onClick(e: PointerEvent): void {
    const {autoplay} = this;
    if (!autoplay) return;
    autoplay.toggle(this.behaviour);
    e.preventDefault();
  }
}

declare global {
  export interface ESLCarouselNS {
    AutoplayControl: typeof ESLCarouselAutoplayControlMixin;
  }
}

