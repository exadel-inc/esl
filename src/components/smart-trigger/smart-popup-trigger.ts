import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const hoverHideDelay = isTouch() ? 0 : 1000;
const hoverShowEvent = isTouch() ? 'click' : 'mouseenter';
const hoverHideEvent = isTouch() ? 'click' : 'mouseleave';
let modeType: any;

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger,
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  protected eventType = {
    showEvent: '',
    hideEvent: ''
  };

  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id', 'data-event', 'data-mode'];

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    this.removeEvent();
    switch (attr) {
      case 'data-target-id':
        if (prevValue !== value) {
          this.popup = document.getElementById(value) as SmartPopup;
        }
        break;
      case 'data-event':
        this.setEvents(value);
        break;
      case 'data-mode':
        this.setMode(value);
        break;
    }
  }

  setEvents(value: string) {
    switch (value) {
      case 'hover':
        this.eventType.showEvent = hoverShowEvent;
        this.eventType.hideEvent = hoverHideEvent;
        break;
      default:
        this.eventType.showEvent = this.eventType.hideEvent = value;
    }
  }

  setMode(value: string) {
    const options = this.popup;
    switch (value) {
      case 'show':
        this.showPopup(options);
        break;
      case 'hide':
        this.hidePopup(options);
        break;
      default:
        if (this.eventType.showEvent === this.eventType.hideEvent) {
          this.addEventListener(this.eventType.showEvent, this.togglePopup(options));
        } else {
          this.showPopup(options);
          this.hidePopup(options);
        }
    }
  }

  protected removeEvent () {
    this.removeEventListener(this.eventType.showEvent, modeType);
    this.removeEventListener(this.eventType.hideEvent, modeType);
  }

  protected showPopup(options: SmartPopup) {
    modeType = () => options.show();
    this.addEventListener(this.eventType.showEvent, modeType)
  }

  protected hidePopup(options: SmartPopup) {
    modeType = () => options.hide();
    this.addEventListener(this.eventType.hideEvent, () => {
      setTimeout(() => {
        modeType();
      }, hoverHideDelay)
    });
  }

  protected togglePopup(options: SmartPopup) {
    return modeType = () => options.toggle()
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export {
  SmartPopupTrigger
}
