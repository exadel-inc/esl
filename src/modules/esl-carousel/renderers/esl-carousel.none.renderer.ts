import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';

import type {ESLCarousel} from '../core/esl-carousel';
import type {ESLCarouselActionParams, ESLCarouselConfig, ESLCarouselDirection} from '../core/esl-carousel.types';

/**
 * None effect carousel renderer. Does not provide any animation, transition. Does not limit slide stage.
 * All slides considered as active. Count properly is ignored (always equal to the total slide count).
 */
@ESLCarouselRenderer.register
export class ESLNoneCarouselRenderer extends ESLCarouselRenderer {
  public static override is = 'none';
  public static override classes: string[] = ['esl-carousel-none-renderer'];

  /** Always equal to slide count (redefined trough constructor) */
  public override readonly count: number;

  constructor($carousel: ESLCarousel, options: ESLCarouselConfig) {
    super($carousel, options);
    // Note blocks touch plugin from activating (consider rework if scroll behaviour is requested)
    Object.defineProperty(this, 'count', {get: () => this.size});
  }

  /**
   * Processes binding of defined renderer to the carousel {@link ESLCarousel}.
   * Prepare to renderer animation.
   */
  public override onBind(): void {
    this.setActive(0);
  }

  public override onUnbind(): void {}

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {}

  /* Handles the slide move actions */
  public move(offset: number, from: number, params: ESLCarouselActionParams): void {}
  public async commit(offset: number, from: number, params: ESLCarouselActionParams): Promise<void> {}
}
