import {ESLBaseElement} from '@exadel/esl/modules/esl-base-element/core';

export interface LogEventData {
  /** The name of the event's class */
  name: string;
  /** The type of the event */
  type: string;
  /** Additional event data */
  data: Record<string, unknown>;
}

/** Base element for logging event data */
export class ESLDemoLogArea extends ESLBaseElement {
  static override is = 'esl-d-logger';

  log(eventData: LogEventData): void {
    const {name, type, data} = eventData;
    const $logItem = document.createElement('div');
    $logItem.className = 'log-item';
    $logItem.innerHTML = `<code>${name}</code> ( ${type} ): <i>{${Object.entries(data).map(([key, value]) => `${key}: ${value}`).join(', ')}}</i>`;
    this.appendChild($logItem);
    this.scrollTo({top: this.scrollHeight, behavior: 'smooth'});
    setTimeout(() => $logItem.classList.add('removed'), 2500);
    setTimeout(() => $logItem.remove(), 3000);
  }
}
