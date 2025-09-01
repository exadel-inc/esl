import {ESLCarouselActionEvent} from './esl-carousel.events.base';

import type {ESLCarousel} from './esl-carousel';
import type {ESLCarouselActionEventBaseInit} from './esl-carousel.events.base';
import type {ESLCarouselDirection, ESLCarouselStaticState} from './esl-carousel.types';

/** {@link ESLCarouselSlideEvent} init object */
export interface ESLCarouselSlideEventInit extends ESLCarouselActionEventBaseInit {
  /** Direction of slide animation */
  direction?: ESLCarouselDirection;
}

type ESLCarouselSlideEventType = typeof ESLCarouselSlideEvent.BEFORE | typeof ESLCarouselSlideEvent.CHANGE | typeof ESLCarouselSlideEvent.AFTER;

/** {@link ESLCarousel} event that represents slide change event */
export class ESLCarouselSlideEvent extends ESLCarouselActionEvent implements ESLCarouselSlideEventInit {
  /** {@link ESLCarouselSlideEvent} cancelable event type dispatched before slide change (pre-event) */
  public static readonly BEFORE = 'esl:before:slide-change';
  /** {@link ESLCarouselSlideEvent} event type dispatched before carousel is going to change active slide (post-event) */
  public static readonly CHANGE = 'esl:slide-change';
  /** {@link ESLCarouselSlideEvent} event type dispatched after slide change (post-event) */
  public static readonly AFTER = 'esl:after:slide-change';

  public override readonly type: ESLCarouselSlideEventType;

  protected constructor(
    type: ESLCarouselSlideEventType,
    init: ESLCarouselSlideEventInit
  ) {
    super(type, {
      bubbles: true,
      cancelable: ESLCarouselSlideEvent.BEFORE === type,
      composed: true
    });
    Object.assign(this, init, type === ESLCarouselSlideEvent.AFTER ? {final: true} : {});
  }

  public static create(type: 'BEFORE' | 'CHANGE' | 'AFTER', init: ESLCarouselSlideEventInit): ESLCarouselSlideEvent {
    return new ESLCarouselSlideEvent(ESLCarouselSlideEvent[type], init);
  }
}

/** {@link ESLCarouselMoveEvent} init object */
export interface ESLCarouselMoveEventInit extends ESLCarouselActionEventBaseInit {
  /** Carousel offset in pixels */
  offset: number;
  /** Carousel offset before the move in pixels */
  offsetBefore: number;
}

/** {@link ESLCarousel} event that represents slide move event */
export class ESLCarouselMoveEvent extends ESLCarouselActionEvent implements ESLCarouselMoveEventInit {
  /** {@link ESLCarouselMoveEvent} event type dispatched on carousel move */
  public static readonly TYPE = 'esl:carousel:move';

  public override readonly type: typeof ESLCarouselMoveEvent.TYPE;

  public readonly offset: number;
  public readonly offsetBefore: number;

  protected constructor(
    type: typeof ESLCarouselMoveEvent.TYPE,
    init: ESLCarouselMoveEventInit
  ) {
    super(type, {
      bubbles: false, // Do not bubble, to improve performance
      cancelable: false,
      composed: true
    });
    const delta = init.offset - init.offsetBefore;
    Object.assign(this, init, {
      final: true, // Move itself is always final
      delta,
      direction: Math.sign(delta)
    });
  }

  public static create(init: ESLCarouselMoveEventInit): ESLCarouselMoveEvent {
    return new ESLCarouselMoveEvent(ESLCarouselMoveEvent.TYPE, init);
  }
}

/** {@link ESLCarouselChangeEvent} init object */
interface ESLCarouselChangeEventInit {
  /** Whether the event is initial (on carousel creation) */
  initial?: boolean;
  /** Current {@link ESLCarousel} instance config */
  config: ESLCarouselStaticState;
  /** Previous {@link ESLCarousel} instance config */
  oldConfig?: ESLCarouselStaticState;
  /** A list of slides that has been added to the current carousel instance */
  added: HTMLElement[];
  /** A list of slides that has been removed from the current carousel instance */
  removed: HTMLElement[];
}

/** {@link ESLCarousel} event that represents slide configuration change */
export class ESLCarouselChangeEvent extends Event implements ESLCarouselChangeEventInit {
  /** {@link ESLCarouselSlideEvent} event type dispatched on carousel config changes */
  public static readonly TYPE = 'esl:carousel:change';

  public override readonly type: typeof ESLCarouselChangeEvent.TYPE;

  public override readonly target: ESLCarousel;
  public readonly initial: boolean = false;
  public readonly config: ESLCarouselStaticState;
  public readonly oldConfig?: ESLCarouselStaticState;
  public readonly added: HTMLElement[] = [];
  public readonly removed: HTMLElement[] = [];

  protected constructor(
    type: typeof ESLCarouselChangeEvent.TYPE,
    init: ESLCarouselChangeEventInit
  ) {
    super(type, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    Object.assign(this, init);
  }

  public static create(init: ESLCarouselChangeEventInit): ESLCarouselChangeEvent {
    return new ESLCarouselChangeEvent(ESLCarouselChangeEvent.TYPE, init);
  }
}
