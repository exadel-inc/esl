import { isTouch } from '../../helpers/device-utils';
import { ISmartTrigger } from './smart-triger-interface';
import { SmartPopup } from '../smart-popup/smart-popup';

const hoverHideDelay = isTouch() ? 0 : 1000;
const hoverShowEvent = isTouch() ? 'click' : 'mouseenter';
const hoverHideEvent = isTouch() ? 'click' : 'mouseleave';

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {
  protected options = {
    showEvent: '',
    hideEvent: '',
    mode: ''
  };
  protected popupShow: EventListener;
  protected popupHide: EventListener;
  protected timerId: number;

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
    }
    if (this.popup && this.options.showEvent && this.options.mode) {
      this.attachEvents();
    }
  }

  protected setEvents(value: string) {
    switch (value) {
      case 'hover':
        this.options.showEvent = hoverShowEvent;
        this.options.hideEvent = hoverHideEvent;
        break;
      default:
        this.options.showEvent = this.options.hideEvent = value;
    }
  }

  setMode(value: string) {
    this.options.mode = value;
  }

  attachEvents() {
    const options = this.popup;
    switch (this.options.mode) {
      case 'show':
        this.addShowEvent(options);
        break;
      case 'hide':
        this.addHideEvent(options);
        break;
      default:
        if (this.options.showEvent === this.options.hideEvent) {
          this.addEventListener(this.options.showEvent, this.togglePopup(options));
        } else {
          if (this.options.hideEvent === 'mouseleave') {
            this.hoverSubEvents();
          }
          this.addShowEvent(options);
          this.addHideEvent(options);
        }
    }
  }

  protected hoverSubEvents() {
    this.popup.addEventListener('mouseenter', () => clearTimeout(this.timerId));
    this.popup.addEventListener('mouseleave', (evt: Event) => this.popupHide(evt))
  }

  protected removeEvent() {
    this.removeEventListener(this.options.showEvent, this.popupShow);
    this.removeEventListener(this.options.hideEvent, this.popupHide);
  }

  protected addShowEvent(options: SmartPopup) {
    this.popupShow = () => options.show();
    this.addEventListener(this.options.showEvent, this.popupShow)
  }

  protected addHideEvent(options: SmartPopup) {
    this.popupHide = () => {
      this.timerId = setTimeout(() => {
        options.hide();
      }, hoverHideDelay);
    };
    this.addEventListener(this.options.hideEvent, this.popupHide);
  }

  protected togglePopup(options: SmartPopup) {
    return this.popupShow = () => options.toggle();
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export {
  SmartPopupTrigger
}
