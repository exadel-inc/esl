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
    return [
      'data-target-id',
      'data-event',
      'data-mode',
      'data-active-class',
      'data-show-delay',
      'data-hide-delay'
    ];
  }

  public popup: SmartPopup;

  protected showEvent = '';
  protected hideEvent = '';
  protected mode = '';
  protected showTimerId: number;
  protected hideTimerId: number;
  protected showDelay = 0;
  protected hideDelay = 0;
  protected activeClass = 'active';

  protected attributeChangedCallback(attr: string, prevValue: string, value: string) {
    this._unbindEvents();
    switch (attr) {
      case 'data-target-id':
        this.setPopup(value);
        break;
      case 'data-event':
        this.setEvents(value);
        break;
      case 'data-mode':
        this.setMode(value);
        break;
      case 'data-active-class':
        this.setActiveClass(value);
        break;
      case 'data-show-delay':
        this.setShowDelay(value);
        break;
      case 'data-hide-delay':
        this.setHideDelay(value);
        break;
    }
    if (this.popup && this.showEvent && this.mode && this.activeClass) {
      this._bindEvents();
    }
  }

  protected setPopup(value: string) {
    this.popup && this.popup.removeEventListener('show', this.onPopupShown);
    this.popup && this.popup.removeEventListener('hide', this.onPopupHidden);
    if (value) {
      this.popup = document.getElementById(value) as SmartPopup;
      this.popup.addEventListener('show', this.onPopupShown);
      this.popup.addEventListener('hide', this.onPopupHidden);
    }
  }

  protected onPopupShown = () => {
    this.classList.add(this.activeClass);
  };

  protected onPopupHidden = () => {
    this.classList.remove(this.activeClass);
  };

  protected setEvents(value: string) {
    value = value || 'click';
    switch (value) {
      case 'hover':
        this.showEvent = HOVER_SHOW_EVENT;
        this.hideEvent = HOVER_HIDE_EVENT;
        break;
      default:
        this.showEvent = this.hideEvent = value;
    }

    if (this.hideEvent === HOVER_HIDE_EVENT) {
      this.hideDelay = HOVER_HIDE_DELAY;
    }
  }

  protected setMode(value: string) {
    this.mode = value || 'toggle';
  }

  protected setActiveClass(value: string) {
    this.activeClass = value || 'active';
  }

  protected setShowDelay(value: string) {
    this.showDelay = parseInt(value) || 0;
  }

  protected setHideDelay(value: string) {
    this.hideDelay = parseInt(value) || 0;
    if (this.hideEvent === HOVER_HIDE_EVENT) {
      this.hideDelay = HOVER_HIDE_DELAY;
    }
  }

  protected _bindEvents() {
    switch (this.mode) {
      case 'show':
        this.bindShowEvent();
        break;
      case 'hide':
        this.bindHideEvent();
        break;
      default:
        if (this.showEvent === this.hideEvent) {
          this.bindToggleEvent();
        } else {
          this.bindShowEvent();
          this.bindHideEvent();
        }
    }
    if (this.hideEvent === 'mouseleave') {
      this.bindHoverSubEvents();
    }
  }

  protected bindHoverSubEvents() {
    this.popup.addEventListener('mouseenter', this.onPopupMouseEnter);
    this.popup.addEventListener('mouseleave', this.onPopupMouseLeave);
  }

  protected onPopupMouseEnter = () => {
    clearTimeout(this.hideTimerId);
  };

  protected onPopupMouseLeave = (e: Event) => {
    this.hidePopup(e);
  };

  protected _unbindEvents() {
    this.removeEventListener(this.showEvent, this.togglePopup);
    this.removeEventListener(this.showEvent, this.showPopup);
    this.removeEventListener(this.hideEvent, this.hidePopup);
  }

  protected stopEventPropagation(e: Event) {
    if (this.popup.closeOnBodyClick && (this.showEvent === 'click' || this.hideEvent === 'click')) {
      e.stopPropagation();
    }
  }

  protected showPopup(e: Event) {
    this.stopEventPropagation(e);
    clearTimeout(this.hideTimerId);
    this.showTimerId = setTimeout(() => {
      this.popup.show();
    }, this.showDelay);
  }

  protected hidePopup(e: Event) {
    this.stopEventPropagation(e);
    clearTimeout(this.showTimerId);
    this.hideTimerId = setTimeout(() => {
      this.popup.hide();
    }, this.hideDelay);
  }

  protected togglePopup(e: Event) {
    this.stopEventPropagation(e);
    this.popup.toggle();
  }

  protected bindShowEvent() {
    this.addEventListener(this.showEvent, this.showPopup);
  }

  protected bindHideEvent() {
    this.addEventListener(this.hideEvent, this.hidePopup);
  }

  protected bindToggleEvent() {
    this.addEventListener(this.showEvent, this.togglePopup);
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export default SmartPopupTrigger;
