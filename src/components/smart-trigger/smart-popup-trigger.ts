import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const HoverHideDelay = isTouch() ? 0 : 1000;
const ShowEventType = isTouch() ? 'click' : 'mouseleave';
const ToggleEventType = isTouch() ? 'click' : 'mouseenter';

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id-toggle', 'data-target-id-show', 'data-target-id-hide'];

  private connectedCallback() {
    if(!!'data-target-id-toggle'){
      this.addEventListener(ToggleEventType, () => {
        (this.popup as SmartPopup).toggle();
      })
    }
  }

  //private disconnectedCallback() { }


  attributeChangedCallback(attr: string, prevValue: string, value: string) {
    switch (attr) {
      case 'data-target-id-toggle':
      case 'data-target-id-show':
      case 'data-target-id-hide':
        if (prevValue !== value) {
          this.popup = document.getElementById(value) as SmartPopup;
        }
    }
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export { SmartPopupTrigger }