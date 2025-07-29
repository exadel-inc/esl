import type {ESLCarousel} from '../../core/esl-carousel';
import type {ESLCarouselAutoplayMixin} from './esl-carousel.autoplay.mixin';

interface ESLCarouselAutoplayEventInit {
  /** Whether autoplay plugin is enabled or disabled */
  enabled: boolean;
  /** Whether autoplay cycle is currently active */
  active: boolean;
  /** Duration of the current autoplay cycle in milliseconds */
  duration: number;
}
/**
 * ESLCarouselAutoplayEvent (esl:autoplay:change) event is dispatched by {@link ESLCarouselAutoplayMixin}
 * on the host {@link ESLCarousel} element when autoplay state changes.
 * It indicates whether autoplay is enabled or disabled, or notifies about the current autoplay cycle start.
 */
export class ESLCarouselAutoplayEvent extends Event implements ESLCarouselAutoplayEventInit {
  public static readonly NAME = 'esl:autoplay:change';

  public override target: ESLCarousel;

  public readonly enabled: boolean;
  public readonly active: boolean;
  public readonly duration: number;

  protected constructor(init: ESLCarouselAutoplayEventInit) {
    super(ESLCarouselAutoplayEvent.NAME, {bubbles: false, cancelable: false});
    Object.assign(this, init);
  }

  public static dispatch(plugin: ESLCarouselAutoplayMixin): boolean {
    const {enabled, active, duration} = plugin;
    const event = new ESLCarouselAutoplayEvent({enabled, active, duration});
    return plugin.$host.dispatchEvent(event);
  }
}
