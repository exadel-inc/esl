import { CustomElement } from '../../../helpers/custom-element';
import { DeviceDetector } from '../../../helpers/device-utils';
import { attr } from '../../../helpers/decorators/attr';
import { SmartPopup } from '../../smart-popup/smart-popup';
import { findTarget } from '../../../helpers/dom-utils';

const HOVER_SHOW_EVENT = DeviceDetector.isTouchDevice ? 'click' : 'mouseenter';
const HOVER_HIDE_EVENT = DeviceDetector.isTouchDevice ? 'click' : 'mouseleave';

// TODO: simplify, unify, cleanup, extend (group as a target)
export class SmartTrigger extends CustomElement {
  public static is = 'smart-trigger';

  static get observedAttributes() {
    return [
      'target',
      'event',
      'mode',
      'active',
      'show-delay',
      'hide-delay',
      'show-delay-on-touch',
      'hide-delay-on-touch'
    ];
  }

  public _popup: SmartPopup;

  @attr({defaultValue: 'parent'}) protected target: string;

  @attr({defaultValue: 'click'}) protected event: string;
  @attr({defaultValue: 'toggle'}) protected mode: string;

  @attr({defaultValue: '0'}) protected showDelay: string;
  @attr({defaultValue: '0'}) protected hideDelay: string;
  @attr({conditional: true}) protected showDelayOnTouch: boolean;
  @attr({conditional: true}) protected hideDelayOnTouch: boolean;

  // TODO: is it state of true ?
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
      case 'target':
        this.updatePopupFromTarget();
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
    this.classList.add(SmartTrigger.is);
    this.bindPopupEvents();
    this.bindHoverSubEvents();
  }

  protected disconnectedCallback() {
    this.unbindPopupEvents();
    this.unbindHoverSubEvents();
  }

  public get popup() {
    if (this._popup === undefined) {
      this.updatePopupFromTarget();
    }
    return this._popup;
  }
  public set popup(newPopupInstance) {
    this._popup && this.unbindPopupEvents();
    this._popup = newPopupInstance;
    if (this._popup) {
      this.active = this._popup.active;
      this.bindPopupEvents();
    }
  }

  get popupClass(): typeof SmartPopup {
    return this._popup && this._popup.constructor as typeof SmartPopup;
  }

  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = findTarget(this.target, this) as SmartPopup;
  }

  protected bindPopupEvents() {
    if (this.popup) {
      this.popup.addEventListener(`${this.popupClass.eventNs}:show`, this.onPopupShown);
      this.popup.addEventListener(`${this.popupClass.eventNs}:hide`, this.onPopupHidden);
    }
  }

  protected unbindPopupEvents() {
    if (this.popup) {
      this.popup.removeEventListener(`${this.popupClass.eventNs}:show`, this.onPopupShown);
      this.popup.removeEventListener(`${this.popupClass.eventNs}:hide`, this.onPopupHidden);
    }
  }

  protected onPopupShown = () => {
    this.active = true;
  };
  protected onPopupHidden = () => {
    this.active = false;
  };

  protected setEvents() {
    if (this.event === 'hover') {
      this._showEvent = HOVER_SHOW_EVENT;
      this._hideEvent = HOVER_HIDE_EVENT;
    } else {
      this._showEvent = this._hideEvent = this.event;
    }
  }

  protected setState() {
    if (this.popup) {
      this.active ? this.popup.show() : this.popup.hide();
    }
  }

  protected setShowDelay() {
    if (!this.showDelayOnTouch && DeviceDetector.isTouchDevice) {
      this._showDelay = 0;
    } else {
      this._showDelay = parseInt(this.showDelay, 10);
    }
  }

  protected setHideDelay() {
    if (!this.hideDelayOnTouch && DeviceDetector.isTouchDevice) {
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
    this._showTimerId = window.setTimeout(() => {
      this.popup.show();
    }, this._showDelay);
  }

  protected hidePopup(e: Event) {
    this.stopEventPropagation(e);
    clearTimeout(this._showTimerId);
    this._hideTimerId = window.setTimeout(() => {
      this.popup.hide();
    }, this._hideDelay);
  }

  protected togglePopup(e: Event) {
    this.active ? this.hidePopup(e) : this.showPopup(e);
  }
  // TODO: unify
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

export default SmartTrigger;
