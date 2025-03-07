import {ESLWheelTarget, ESLWheelEvent} from '@exadel/esl/modules/esl-event-listener/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

import {ESLDemoLogArea} from '../log-area/log-area';

/** Area element for logging long wheel event data */
export class ESLDemoWheelArea extends ESLDemoLogArea {
  static override is = 'esl-d-wheel-area';

  @listen({
    event: 'longwheel',
    target: ESLWheelTarget.for
  })
  onWheel(e: ESLWheelEvent): void {
    const {name} = ESLWheelEvent;
    const {type, axis, deltaX, deltaY} = e;
    this.log({name, type, data: {axis, deltaX, deltaY}});
  }
}
