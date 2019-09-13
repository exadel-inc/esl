import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const hoverHideDelay = isTouch() ? 0 : 5000;
let showEventType = isTouch() ? 'click' : 'mouseenter';
const hideEventType = isTouch() ? 'click' : 'mouseleave';
let modeType: any;

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger,
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id', 'data-event', 'data-mode'];

  protected connectedCallback() {
    this.attachEvent()
  }

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    const pop = this.popup;
    switch (attr) {
      case 'data-target-id':
        if (prevValue !== value) {
          this.popup = document.getElementById(value) as SmartPopup;
        }
        break;
      case 'data-event':
        this.removeEvent();
        value === 'click' ? showEventType = 'click' :
          value === 'mouseleave' ? hideEventType :
             value === 'hover' ? this.attachEvent() :
               showEventType;
        this.attachEvent();
        break;
      case 'data-mode':
        this.removeEvent();
        value === 'show' ? this.isShow(pop) :
          value === 'hide' ? this.isHide(pop) :
            this.isToggle(pop);
        this.attachEvent();
        break;
    }
  }

  attachEvent() {
    this.addEventListener(showEventType, modeType);
    this.addEventListener(hideEventType, modeType)
  }

  removeEvent() {
    this.removeEventListener(showEventType, modeType);
    this.removeEventListener(hideEventType, modeType);
  }

  isShow(pop: SmartPopup) {
    return modeType = () => pop.show()
  }

  isHide(pop: SmartPopup) {
    return modeType = () => pop.hide()
  }

  isToggle(pop: SmartPopup) {
    return modeType = () => pop.toggle()
  }

}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export { SmartPopupTrigger }
