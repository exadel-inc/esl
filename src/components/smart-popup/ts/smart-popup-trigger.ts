import { isTouch } from '@helpers/device-utils';
import { attr } from '@helpers/decorators/attr';
import SmartPopup from './smart-popup';

const HOVER_SHOW_EVENT = isTouch() ? 'click' : 'mouseenter';
const HOVER_HIDE_EVENT = isTouch() ? 'click' : 'mouseleave';

export interface ISmartPopupTrigger extends HTMLElement {
  popup: SmartPopup;
}

class SmartPopupTrigger extends HTMLElement implements ISmartPopupTrigger {

  static get is() {
    return 'smart-popup-trigger';
  }

  static get observedAttributes() {
    return [
      'target-id',
      'event',
      'mode',
      'active',
      'show-delay',
      'hide-delay',
      'show-delay-on-touch',
      'hide-delay-on-touch'
    ];
  }

  public popup: SmartPopup;

  @attr() protected targetId: string;
  @attr({defaultValue: 'click'}) protected event: string;
  @attr({defaultValue: 'toggle'}) protected mode: string;
  @attr({defaultValue: '0'}) protected showDelay: string;
  @attr({defaultValue: '0'}) protected hideDelay: string;
  @attr({conditional: true}) protected showDelayOnTouch: boolean;
  @attr({conditional: true}) protected hideDelayOnTouch: boolean;
  @attr({conditional: true}) protected active: boolean;

  protected _showTimerId: number;
  protected _hideTimerId: number;
  protected _showEvent: string;
  protected _hideEvent: string;
  protected _showDelay: number = 0;
  protected _hideDelay: number = 0;

  protected attributeChangedCallback(attrName: string) {
    this._unbindEvents();
    switch (attrName) {
      case 'target-id':
        this.setPopup();
        break;
      case 'active':
        this.setState();
        break;
      case 'event':
        this.setEvents();
        break;
      case 'show-delay':
      case 'show-delay-on-touch':
        this.setShowDelay();
        break;
      case 'hide-delay':
      case 'hide-delay-on-touch':
        this.setHideDelay();
        break;
    }
    if (this.popup && this._showEvent && this.mode) {
      this._bindEvents();
    }
  }

  protected connectedCallback() {
    this.classList.add(SmartPopupTrigger.is);
    this.bindPopupEvents();
    this.bindHoverSubEvents();
  }

  protected disconnectedCallback() {
    this.unbindPopupEvents();
    this.unbindHoverSubEvents();
  }

  protected setPopup() {
    this.unbindPopupEvents();
    if (this.targetId) {
      this.popup = document.getElementById(this.targetId) as SmartPopup;
      if (this.popup && this.popup.active) {
        this.active = true;
      }
      this.bindPopupEvents();
    }
  }

  protected bindPopupEvents() {
    if (this.popup) {
      this.popup.addEventListener('show', this.onPopupShown);
      this.popup.addEventListener('hide', this.onPopupHidden);
    }
  }

  protected unbindPopupEvents() {
    if (this.popup) {
      this.popup.removeEventListener('show', this.onPopupShown);
      this.popup.removeEventListener('hide', this.onPopupHidden);
    }
  }

  protected onPopupShown = () => {
    this.active = true;
  };

  protected onPopupHidden = () => {
    this.active = false;
  };

  protected setEvents() {
    switch (this.event) {
      case 'hover':
        this._showEvent = HOVER_SHOW_EVENT;
        this._hideEvent = HOVER_HIDE_EVENT;
        break;
      default:
        this._showEvent = this._hideEvent = this.event;
    }
  }

  protected setState() {
    if (this.popup) {
      this.active ? this.popup.show() : this.popup.hide();
    }
  }

  protected setShowDelay() {
    if (!this.showDelayOnTouch && isTouch()) {
      this._showDelay = 0;
    } else {
      this._showDelay = parseInt(this.showDelay, 10);
    }
  }

  protected setHideDelay() {
    if (!this.hideDelayOnTouch && isTouch()) {
      this._hideDelay = 0;
    } else {
      this._hideDelay = parseInt(this.hideDelay, 10);
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
        if (this._showEvent === this._hideEvent) {
          this.bindToggleEvent();
        } else {
          this.bindShowEvent();
          this.bindHideEvent();
        }
    }
    this.unbindHoverSubEvents();
    this.bindHoverSubEvents();
  }

  protected unbindHoverSubEvents() {
    if (this.popup) {
      this.popup.removeEventListener('mouseenter', this.onPopupMouseEnter);
      this.popup.removeEventListener('mouseleave', this.onPopupMouseLeave);
    }
  }

  protected bindHoverSubEvents() {
    if (this.popup && this._hideEvent === 'mouseleave') {
      this.popup.addEventListener('mouseenter', this.onPopupMouseEnter);
      this.popup.addEventListener('mouseleave', this.onPopupMouseLeave);
    }
  }

  protected onPopupMouseEnter = () => {
    clearTimeout(this._hideTimerId);
  };

  protected onPopupMouseLeave = (e: Event) => {
    this.hidePopup(e);
  };

  protected _unbindEvents() {
    this.removeEventListener(this._showEvent, this.togglePopup);
    this.removeEventListener(this._showEvent, this.showPopup);
    this.removeEventListener(this._hideEvent, this.hidePopup);
  }

  protected stopEventPropagation(e: Event) {
    if (this.popup.closeOnBodyClick && (this._showEvent === 'click' || this._hideEvent === 'click')) {
      e.stopPropagation();
    }
  }

  protected showPopup(e: Event) {
    this.stopEventPropagation(e);
    clearTimeout(this._hideTimerId);
    this._showTimerId = setTimeout(() => {
      this.popup.show();
    }, this._showDelay);
  }

  protected hidePopup(e: Event) {
    this.stopEventPropagation(e);
    clearTimeout(this._showTimerId);
    this._hideTimerId = setTimeout(() => {
      this.popup.hide();
    }, this._hideDelay);
  }

  protected togglePopup(e: Event) {
    this.active ? this.hidePopup(e) : this.showPopup(e);
  }

  protected bindShowEvent() {
    this.addEventListener(this._showEvent, this.showPopup);
  }

  protected bindHideEvent() {
    this.addEventListener(this._hideEvent, this.hidePopup);
  }

  protected bindToggleEvent() {
    this.addEventListener(this._showEvent, this.togglePopup);
  }
}

customElements.define(SmartPopupTrigger.is, SmartPopupTrigger);
export default SmartPopupTrigger;
