import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const hoverHideDelay = isTouch() ? 0 : 5000;
const hoverShowEvent = isTouch() ? 'click' : 'mouseenter';
const hoverHideEvent = isTouch() ? 'click' : 'mouseleave';
let modeType: any;

const events: Array<Object> = [];

export interface ISmartPopupActionParams {
  trigger?: ISmartTrigger,
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  protected eventType = {
    showEvent: '',
    hideEvent: '',
    hideDelay: 0,
    showDelay: 0,
  };

  static readonly is: string = 'smart-popup-trigger';
  public popup: SmartPopup;

  static observedAttributes: Array<string> = ['data-target-id', 'data-event', 'data-mode'];

  protected connectedCallback() {
  }

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    // this.removeEvents();
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

    if (this.eventType.hideEvent === hoverHideEvent && isNaN(hoverHideDelay)) {
      this.eventType.hideDelay = hoverHideDelay;
    }
  }

  setMode(value: string) {
    this.removeEvents();
    const options = this.popup;
    switch (value) {
      case 'show':
        this.addEventListener(this.eventType.showEvent, modeType = () => options.show());
        events.push({ event: this.eventType.showEvent, handler: options.show });
        break;
      case 'hide':
        this.addEventListener(this.eventType.hideEvent, modeType = () => options.hide());
        events.push({ event: this.eventType.hideEvent, handler: options.hide });
        break;
      default:
        if (this.eventType.showEvent === this.eventType.hideEvent) {
          this.addEventListener(this.eventType.showEvent, modeType = () => options.toggle());
        } else {
          this.addEventListener(this.eventType.showEvent, modeType = () => options.show());
          this.addEventListener(this.eventType.hideEvent, modeType = () => options.hide());
        }
    }
    events.forEach((event: any) => {
      this.addEventListener(event.event, event.handler);
    })
  }


  removeEvents() {
    events.forEach((event: any) => {
      this.removeEventListener(event.event, event.handler);
    })
  }
}


customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export {
  SmartPopupTrigger
}
