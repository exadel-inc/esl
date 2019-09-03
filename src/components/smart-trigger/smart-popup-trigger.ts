import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

// const HoverHideDelay = isTouch() ? 0 : 1000;
// const ShowEventType = isTouch() ? 'click' : 'mouseleave';
let eventType = isTouch() ? 'click' : 'mouseenter';
let modeType = function () {
  (this.popup as SmartPopup).toggle();
}

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id', 'data-event', 'data-mode'];

  protected connectedCallback() {
    this.addEventListener(eventType, modeType)
  }

  //private disconnectedCallback() { }


  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    switch (attr) {
      case 'data-target-id':
        if (prevValue !== value) {
          this.popup = document.getElementById(value) as SmartPopup;
        }
        break;
      case 'data-event':
        value === 'click' ? eventType = 'click' : value === 'mouseleave' ? eventType = 'mouseleave' : eventType;
        break;
      case 'data-mode':
        value === 'show' ? modeType = function () {(this.popup as SmartPopup).show(); } : value === 'hide' ? modeType = function () {(this.popup as SmartPopup).hide(); } : modeType;
        break;
    }
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export { SmartPopupTrigger }
