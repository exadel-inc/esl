import {ESLBaseElement} from '../../../src/modules/esl-base-element/core';
import {ESLSwipeGestureTarget} from '../../../src/modules/esl-event-listener/core';
import {listen} from '../../../src/modules/esl-utils/decorators';

import type {ESLSwipeGestureEvent} from '../../../src/modules/esl-event-listener/core';

export class ESLDemoSwipeArea extends ESLBaseElement {
  static override is = 'esl-d-swipe-area';

  @listen({
    event: 'swipe swipe:left swipe:right swipe:up swipe:down',
    target: ESLSwipeGestureTarget.for
  })
  onSwipe(e: ESLSwipeGestureEvent): void {
    const $logItem = document.createElement('div');
    $logItem.className = 'log-item';
   // TODO: uncomment hen event will be fixed
   // const {type, direction, distanceX, distanceY} = e;
   // $logItem.innerHTML = `<code>ESLSwipeGestureEvent</code> ( ${type} ): <i>${direction} ( x: ${distanceX} , y: ${distanceY})</i>`;
    $logItem.textContent = JSON.stringify(e);
    this.appendChild($logItem);
    this.scrollTo({top: this.scrollHeight, behavior: 'smooth'});
    setTimeout(() => $logItem.classList.add('removed'), 2500);
    setTimeout(() => $logItem.remove(), 3000);
  }
}
