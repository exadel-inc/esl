import { ESLBaseElement, attr } from '../../esl-base-element/esl-base-element';
import { DeviceDetector } from '../../esl-utils/enviroment/device-detector';
import { SmartPopup } from '../../smart-popup/smart-popup';
import { findTarget } from '../../esl-utils/dom/traversing';
import type { NoopFnSignature } from '../../esl-utils/misc/functions';

export class SmartTrigger extends ESLBaseElement {
  public static is = 'smart-trigger';

  static get observedAttributes() {
    return ['target', 'event', 'mode', 'active'];
  }

  // Markers
  @attr({conditional: true}) protected active: boolean;

  // Main setting
  @attr({defaultValue: 'next'}) protected target: string;
  @attr({defaultValue: 'click'}) protected event: string;
  @attr({defaultValue: 'toggle'}) protected mode: string;

  // Common properties
  @attr({}) protected showDelay: string;
  @attr({}) protected hideDelay: string;
  @attr({}) protected touchShowDelay: string;
  @attr({}) protected touchHideDelay: string;

  protected _popup: SmartPopup;
  protected __unsubscribers: NoopFnSignature[];

  protected attributeChangedCallback(attrName: string) {
    if (!this.connected) return;
    switch (attrName) {
      case 'target':
        this.updatePopupFromTarget();
        break;
      case 'mode':
      case 'event':
        this.unbindEvents();
        this.bindEvents();
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
  }

  public get popup() {
    return this._popup;
  }
  public set popup(newPopupInstance) {
    this.unbindEvents();
    this._popup = newPopupInstance;
    if (this._popup) {
      this.active = this._popup.open;
      this.bindEvents();
    }
  }
  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = findTarget(this.target, this) as SmartPopup;
  }

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
    if (!this.popup) return;
    if (this.showEvent === this.hideEvent) {
      this.attachEventListener(this.showEvent, this.onToggleEvent);
    } else {
      this.attachEventListener(this.showEvent, this.onShowEvent);
      this.attachEventListener(this.hideEvent, this.onHideEvent);
    }
    const popupClass = this._popup.constructor as typeof SmartPopup;
    this.popup.addEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);
  }
  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.popup) return;
    const popupClass = this._popup.constructor as typeof SmartPopup;
    this.popup.removeEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);
  }
  protected attachEventListener(eventName: string, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }

  protected onShowEvent = (e: Event) => {
    this.stopEventPropagation(e);
    this.popup.show({
      trigger: this,
      delay: this.showDelayValue
    });
  };
  protected onHideEvent = (e: Event) => {
    this.stopEventPropagation(e);
    this.popup.hide({
      trigger: this,
      delay: this.hideDelayValue,
      trackHover: this.event === 'hover' && this.mode === 'toggle'
    });
  };
  protected onToggleEvent = (e: Event) => (this.active ? this.onHideEvent : this.onShowEvent)(e);
  protected onPopupStateChanged = () => {
    this.active = this.popup.open;
  };

  protected stopEventPropagation(e: Event) {
    if (this.popup.closeOnBodyClick && e.type === 'click') {
      e.stopPropagation();
    }
  }

  protected get showDelayValue() {
    const showDelay = DeviceDetector.isTouchDevice ? +this.touchShowDelay : +this.showDelay;
    return isNaN(showDelay) ? undefined : showDelay;
  }
  protected get hideDelayValue() {
    const hideDelay = DeviceDetector.isTouchDevice ? +this.touchHideDelay : +this.hideDelay;
    return isNaN(hideDelay) ? undefined : hideDelay;
  }
}

export default SmartTrigger;
