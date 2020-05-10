import { CustomElement } from '../../../helpers/custom-element';
import { DeviceDetector } from '../../../helpers/device-utils';
import { attr } from '../../../helpers/decorators/attr';
import { SmartPopup } from '../../smart-popup/smart-popup';
import { findTarget } from '../../../helpers/dom-utils';


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

  // Markers
  @attr({conditional: true}) protected active: boolean;

  // Main setting
  @attr({defaultValue: 'next'}) protected target: string;
  @attr({defaultValue: 'click'}) protected event: string;
  @attr({defaultValue: 'toggle'}) protected mode: string;

  // Common properties
  @attr({defaultValue: '0'}) protected showDelay: string;
  @attr({defaultValue: '0'}) protected hideDelay: string;
  @attr({conditional: true}) protected showDelayOnTouch: boolean;
  @attr({conditional: true}) protected hideDelayOnTouch: boolean;

  protected _popup: SmartPopup;
  protected _showTimerId: number;
  protected _hideTimerId: number;
  protected _showDelay: number = 0;
  protected _hideDelay: number = 0;

  protected __unsubscribers: Function[];

  protected attributeChangedCallback(attrName: string) {
    switch (attrName) {
      case 'target':
        this.updatePopupFromTarget();
        break;
      case 'event':
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
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.updatePopupFromTarget();
    this.bindEvents();
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    this.unbindPopupEvents();
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
      this.active = this._popup.open;
      this.bindPopupEvents();
    }
  }
  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = findTarget(this, this.target) as SmartPopup;
  }

  protected bindPopupEvents() {
    if (!this.popup) return;
    const popupClass = this._popup.constructor as typeof SmartPopup;
    this.popup.addEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);
    if (!DeviceDetector.isTouchDevice && this.event === 'hover') {
      this.popup.addEventListener('mouseenter', this.onPopupMouseEnter);
      this.popup.addEventListener('mouseleave', this.onPopupMouseLeave);
    }
  }
  protected unbindPopupEvents() {
    if (!this.popup) return;
    const popupClass = this._popup.constructor as typeof SmartPopup;
    this.popup.removeEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);
    this.popup.removeEventListener('mouseenter', this.onPopupMouseEnter);
    this.popup.removeEventListener('mouseleave', this.onPopupMouseLeave);
  }

  protected onPopupMouseEnter = () => this.showPopup();
  protected onPopupMouseLeave = () => this.hidePopup();
  protected onPopupStateChanged = () => {
    this.active = this.popup.open;
  };

  public get showEvent() {
    if (this.mode === 'hide') return null;
    if (this.event === 'hover') {
      return DeviceDetector.isTouchDevice ? 'click' : 'mouseenter';
    }
    return this.event;
  }
  public get hideEvent() {
    if (this.mode === 'show') return null;
    if (this.event === 'hover') {
      if (DeviceDetector.isTouchDevice) return 'click';
      return this.mode === 'hide' ? 'mouseenter' : 'mouseleave';
    }
    return this.event;
  }

  protected bindEvents() {
    this.attachEventListener(this.showEvent, this.onShowEvent);
    this.attachEventListener(this.hideEvent, this.onHideEvent);
  }
  protected attachEventListener(eventName: string, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }
  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
  }

  protected onShowEvent = (e: Event) => {
    this.stopEventPropagation(e);
    if (this.active) return;
    this.showPopup();
  };
  protected onHideEvent = (e: Event) => {
    this.stopEventPropagation(e);
    if (!this.active) return;
    this.hidePopup();
  };
  protected stopEventPropagation(e: Event) {
    if (this.popup.closeOnBodyClick && (this.showEvent === 'click' || this.hideEvent === 'click')) {
      e.stopPropagation();
    }
  }

  public showPopup() {
    clearTimeout(this._hideTimerId);
    if (this.active) return;
    this._showTimerId = window.setTimeout(() => {
      this.popup.show();
    }, this._showDelay);
  }
  public hidePopup() {
    clearTimeout(this._showTimerId);
    if (!this.active) return;
    this._hideTimerId = window.setTimeout(() => {
      this.popup.hide();
    }, this._hideDelay);
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
}

export default SmartTrigger;
