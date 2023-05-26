import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselSlide} from './esl-carousel.slide';
import type {ESLCarouselDirection} from './nav/esl-carousel.nav.types';

interface ESLCarouselSlideEventInit {
  current: number;
  related: number;
  direction: ESLCarouselDirection;
  activator?: any;
}

export class ESLCarouselSlideEvent extends Event implements ESLCarouselSlideEventInit {
  public static readonly BEFORE = 'esl:before:slide:change';
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

interface ESLCarouselChangeEventInit {
  prop: string;
  addedSlide?: ESLCarouselSlide;
  removedSlide?: ESLCarouselSlide;
}

export class ESLCarouselChangeEvent extends Event implements ESLCarouselChangeEventInit {
  public static readonly TYPE = 'esl:carousel:change';

  public override readonly target: ESLCarousel;
  public readonly prop: string;

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
