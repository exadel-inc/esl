import { isTouch } from '@helpers/device-utils';
import SmartPopup from './smart-popup';

const HOVER_HIDE_DELAY = isTouch() ? 0 : 1000;
const HOVER_SHOW_EVENT = isTouch() ? 'click' : 'mouseenter';
const HOVER_HIDE_EVENT = isTouch() ? 'click' : 'mouseleave';

export interface ISmartTrigger extends HTMLElement {
}

class SmartPopupTrigger extends HTMLElement implements ISmartTrigger {

  static get is() {
    return 'smart-popup-trigger';
  }

  static get observedAttributes() {
    return ['data-target-id', 'data-event', 'data-mode'];
  }

  public popup: SmartPopup;

  protected options = {
    showEvent: '',
    hideEvent: '',
    mode: ''
  };
  protected popupShow: EventListener;
  protected popupHide: EventListener;
  protected timerId: number;
  protected hideDelay = 0;

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    this.removeEvents();
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
        this.options.showEvent = HOVER_SHOW_EVENT;
        this.options.hideEvent = HOVER_HIDE_EVENT;
        break;
      default:
        this.options.showEvent = this.options.hideEvent = value;
    }

    if (this.options.hideEvent === HOVER_HIDE_EVENT) {
      this.hideDelay = HOVER_HIDE_DELAY;
    } else {
      this.hideDelay = 0;
    }
  }

  protected setMode(value: string) {
    this.options.mode = value;
  }

  protected attachEvents() {
    switch (this.options.mode) {
      case 'show':
        this.addShowEvent();
        break;
      case 'hide':
        this.addHideEvent();
        break;
      default:
        if (this.options.showEvent === this.options.hideEvent) {
          this.addToggleEvent();
        } else {
          this.addShowEvent();
          this.addHideEvent();
        }
    }
    if (this.options.hideEvent === 'mouseleave') {
      this.hoverSubEvents();
    }
  }

  protected hoverSubEvents() {
    this.popup.addEventListener('mouseenter', () => clearTimeout(this.timerId));
    this.popup.addEventListener('mouseleave', (e: Event) => this.popupHide(e));
  }

  protected removeEvents() {
    this.removeEventListener(this.options.showEvent, this.popupShow);
    this.removeEventListener(this.options.hideEvent, this.popupHide);
  }

  protected addShowEvent() {
    this.popupShow = () => this.popup.show();
    this.addEventListener(this.options.showEvent, this.popupShow);
  }

  protected addHideEvent() {
    this.popupHide = () => {
      this.timerId = setTimeout(() => {
        this.popup.hide();
      }, this.hideDelay);
    };
    this.addEventListener(this.options.hideEvent, this.popupHide);
  }

  protected addToggleEvent() {
    this.popupShow = () => this.popup.toggle();
    this.addEventListener(this.options.showEvent, this.popupShow);
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export default SmartPopupTrigger;
