import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';
import {ESLWheelTarget} from '@exadel/esl/modules/esl-event-listener/core';
import {listen} from '@exadel/esl/modules/esl-utils/decorators';

import type {ESLWheelEvent} from '@exadel/esl/modules/esl-event-listener/core';

export class ESLDemoWheelArea extends ESLBaseElement {
  static override is = 'esl-d-wheel-area';

  @listen({
    event: 'longwheel',
    target: ESLWheelTarget.for
  })
  onWheel(e: ESLWheelEvent): void {
    const $logItem = document.createElement('div');
    $logItem.className = 'log-item';
    const {type, axis, deltaX, deltaY} = e;
    $logItem.innerHTML = `<code>ESLWheelEvent</code> ( ${type} ): (
      axis: ${axis},
      x: ${deltaX},
      y: ${deltaY}}
    )</i>`;
    this.appendChild($logItem);
    this.scrollTo({top: this.scrollHeight, behavior: 'smooth'});
    setTimeout(() => $logItem.classList.add('removed'), 2500);
    setTimeout(() => $logItem.remove(), 3000);
  }
}
