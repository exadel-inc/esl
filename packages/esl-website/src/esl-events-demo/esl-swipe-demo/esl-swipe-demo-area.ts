import {ESLSwipeGestureTarget, ESLSwipeGestureEvent} from '@exadel/esl/modules/esl-event-listener/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

import {ESLDemoLogArea} from '../log-area/log-area';

/** Area element for logging swipe event data */
export class ESLDemoSwipeArea extends ESLDemoLogArea {
  static override is = 'esl-d-swipe-area';

  @listen({
    event: 'swipe',
    target: ESLSwipeGestureTarget.for
  })
  onSwipe(e: ESLSwipeGestureEvent): void {
    const {name} = ESLSwipeGestureEvent;
    const {type, direction, distanceX, distanceY, distance, angle} = e;
    this.log({name, type, data: {direction, distanceX, distanceY, distance, angle}});
  }
}
