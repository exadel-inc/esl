import {ESLCarouselRenderer} from '../core/esl-carousel.renderer';

import type {ESLCarousel} from '../core/esl-carousel';
import type {ESLCarouselConfig, ESLCarouselDirection} from '../core/nav/esl-carousel.nav.types';

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

  public override onUnbind(): void {
    // this.$carousel.scrollTop = this.$carousel.scrollLeft = 0;
  }

  /** Processes animation. */
  public async onAnimate(nextIndex: number, direction: ESLCarouselDirection): Promise<void> {
  }

  /** Handles the slides transition. */
  public onMove(offset: number): void {
    // TODO: implement if scroll behaviour requested
    // const property = this.vertical ? 'scrollTop' : 'scrollLeft';
    // this.$carousel[property] = -offset;
  }
  public commit(offset?: number): void {
  }
}
