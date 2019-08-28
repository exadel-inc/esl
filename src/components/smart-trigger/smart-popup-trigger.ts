import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const HOVER_HIDE_DELAY = isTouch ? 0 : 1000;
const HOVER_HIDE_EVENT = isTouch ? 'mouseleave' : 'click';
const HOVER_SHOW_EVENT = isTouch ? 'click' : 'mouseenter';

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id'];

  private connectedCallback() {
    this.addEventListener(HOVER_HIDE_EVENT, () => {
      isTouch();
      (this.popup as SmartPopup).toggle();
    })
  }

  //private disconnectedCallback() { }


  attributeChangedCallback(attr: string, prevValue: string, value: string) {
    switch (attr) {
      case 'data-target-id':
        if (prevValue !== value) {
          this.popup = document.getElementById(value) as SmartPopup;
        }
    }
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export { SmartPopupTrigger }