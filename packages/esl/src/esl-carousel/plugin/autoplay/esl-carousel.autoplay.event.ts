import type {ESLCarousel} from '../../core/esl-carousel';
import type {ESLCarouselAutoplayReason, ESLCarouselAutoplayState} from './esl-carousel.autoplay.types';

interface ESLCarouselAutoplayEventInit {
  /** Whether autoplay plugin is enabled or disabled */
  enabled: boolean;
  /** Whether autoplay is currently paused */
  paused: boolean;
  /** Whether autoplay is currently blocked by runtime conditions */
  blocked: boolean;
  /** Whether autoplay cycle is currently active */
  active: boolean;
  /** Exclusive autoplay runtime state */
  state: ESLCarouselAutoplayState;
  /** Full duration of the current autoplay cycle in milliseconds */
  duration: number;
  /** Remaining duration of the current autoplay cycle in milliseconds */
  remaining: number;
  /** Compact machine-readable description of the latest autoplay state change */
  reason?: ESLCarouselAutoplayReason;
}
/**
 * ESLCarouselAutoplayEvent (esl:autoplay:change) event is dispatched by {@link ESLCarouselAutoplayMixin}
 * on the host {@link ESLCarousel} element when autoplay state changes.
 * It indicates whether autoplay is enabled or disabled, or notifies about the current autoplay cycle start.
 */
export class ESLCarouselAutoplayEvent extends Event implements ESLCarouselAutoplayEventInit {
  public static readonly NAME = 'esl:autoplay:change';

  public override readonly type: typeof ESLCarouselAutoplayEvent.NAME;

  public override target: ESLCarousel;

  public readonly enabled: boolean;
  public readonly paused: boolean;
  public readonly blocked: boolean;
  public readonly active: boolean;
  public readonly state: ESLCarouselAutoplayState;
  public readonly duration: number;
  public readonly remaining: number;
  public readonly reason?: ESLCarouselAutoplayReason;

  public constructor(init: ESLCarouselAutoplayEventInit) {
    super(ESLCarouselAutoplayEvent.NAME, {bubbles: false, cancelable: false});
    Object.assign(this, init);
  }

  public toFingerprint(): string {
    const {enabled, paused, blocked, active, duration, remaining, reason} = this;
    return [enabled, paused, blocked, active, duration, remaining, reason].join('|');
  }
}
