import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLSwipeGestureTarget} from '@exadel/esl/modules/esl-event-listener/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

import type {ESLSwipeGestureEvent} from '@exadel/esl/modules/esl-event-listener/core';

export class ESLDemoSwipeArea extends ESLBaseElement {
  static override is = 'esl-d-swipe-area';

  @listen({
    event: 'swipe',
    target: ESLSwipeGestureTarget.for
  })
  onSwipe(e: ESLSwipeGestureEvent): void {
    const $logItem = document.createElement('div');
    $logItem.className = 'log-item';
    const {type, direction, distanceX, distanceY, distance, angle} = e;
    $logItem.innerHTML = `<code>ESLSwipeGestureEvent</code> ( ${type} ): <i>${direction} (
      x: ${distanceX},
      y: ${distanceY},
      distance: ${distance},
      angle: ${angle}
    )</i>`;
    this.appendChild($logItem);
    this.scrollTo({top: this.scrollHeight, behavior: 'smooth'});
    setTimeout(() => $logItem.classList.add('removed'), 2500);
    setTimeout(() => $logItem.remove(), 3000);
  }
}
