import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselSlide} from './esl-carousel.slide';
import type {ESLCarouselDirection, ESLCarouselStaticState} from './nav/esl-carousel.nav.types';

/** {@link ESLCarouselSlideEvent} init object */
export interface ESLCarouselSlideEventInit {
  /** Current slide index */
  current: number;
  /** Related slide index (target on pre-event, current on post-event) */
  related: number;
  /** Direction of slide animation */
  direction: ESLCarouselDirection;
  /** Auxiliary request attribute that represents object that initiates slide change */
  activator?: any;
}

/** {@link ESLCarousel} event that represents slide change event */
export class ESLCarouselSlideEvent extends Event implements ESLCarouselSlideEventInit {
  /** {@link ESLCarouselSlideEvent} event type dispatched before slide change (pre-event) */
  public static readonly BEFORE = 'esl:before:slide:change';
  /** {@link ESLCarouselSlideEvent} event type dispatched after slide change (post-event) */
  public static readonly AFTER = 'esl:slide:change';

  public override readonly target: ESLCarousel;
  public readonly current: number;
  public readonly related: number;
  public readonly direction: ESLCarouselDirection;
  public readonly activator?: any;

  protected constructor(
    type: string,
    init: ESLCarouselSlideEventInit
  ) {
    super(type, {
      bubbles: true,
      cancelable: ESLCarouselSlideEvent.BEFORE === type,
      composed: true
    });
    Object.assign(this, init);
  }

  public static create(type: 'BEFORE' | 'AFTER', init: ESLCarouselSlideEventInit): ESLCarouselSlideEvent {
    return new ESLCarouselSlideEvent(ESLCarouselSlideEvent[type], init);
  }
}

/** {@link ESLCarouselChangeEvent} init object */
interface ESLCarouselChangeEventInit {
  /** Current {@link ESLCarousel} instance config */
  config: ESLCarouselStaticState;
  /** Previous {@link ESLCarousel} instance config */
  oldConfig?: ESLCarouselStaticState;
  /** A list of {@link ESLCarouselSlide}s that has been added to the current carousel instance */
  added: ESLCarouselSlide[];
  /** A list of {@link ESLCarouselSlide}s that has been removed from the current carousel instance */
  removed: ESLCarouselSlide[];
}

/** {@link ESLCarousel} event that represents slide configuration change */
export class ESLCarouselChangeEvent extends Event implements ESLCarouselChangeEventInit {
  /** {@link ESLCarouselSlideEvent} event type dispatched on carousel config changes */
  public static readonly TYPE = 'esl:carousel:change';

  public override readonly target: ESLCarousel;
  public readonly config: ESLCarouselStaticState;
  public readonly oldConfig?: ESLCarouselStaticState;
  public readonly added: ESLCarouselSlide[] = [];
  public readonly removed: ESLCarouselSlide[] = [];

  protected constructor(init: ESLCarouselChangeEventInit) {
    super(ESLCarouselChangeEvent.TYPE, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    Object.assign(this, init);
  }

  public static create(init: ESLCarouselChangeEventInit): ESLCarouselChangeEvent {
    return new ESLCarouselChangeEvent(init);
  }
}