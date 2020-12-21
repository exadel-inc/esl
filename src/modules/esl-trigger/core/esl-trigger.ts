import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {ESLBasePopup} from '../../esl-base-popup/core/esl-base-popup';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {bind} from '../../esl-utils/decorators/bind';
import {ENTER, SPACE} from '../../esl-utils/dom/keycodes';
import {TraversingQuery} from '../../esl-traversing-query/core';

import type {NoopFnSignature} from '../../esl-utils/misc/functions';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static is = 'esl-trigger';
  public static eventNs = 'esl:trigger';

  static get observedAttributes() {
    return ['target', 'event', 'mode', 'active'];
  }

  // Markers
  @boolAttr() public active: boolean;

  // Main setting
  @attr({defaultValue: 'next'}) public target: string;
  @attr({defaultValue: 'click'}) public event: string;
  @attr({defaultValue: 'toggle'}) public mode: string;
  @attr({defaultValue: ''}) public a11yTarget: string;

  @attr({defaultValue: ''}) public activeClass: string;
  @attr({defaultValue: ''}) public activeClassTarget: string;

  // Common properties
  @attr() public showDelay: string;
  @attr() public hideDelay: string;
  @attr() public touchShowDelay: string;
  @attr() public touchHideDelay: string;

  protected _popup: ESLBasePopup;
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
      this.bindEvents();
      this._onPopupStateChange();
    }
  }

  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = TraversingQuery.first(this.target, this) as ESLBasePopup;
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
      this.attachEventListener(this.showEvent, this._onToggleEvent);
    } else {
      this.attachEventListener(this.showEvent, this._onShowEvent);
      this.attachEventListener(this.hideEvent, this._onHideEvent);
    }
    const popupClass = this._popup.constructor as typeof ESLBasePopup;
    this.popup.addEventListener(`${popupClass.eventNs}:statechange`, this._onPopupStateChange);

    this.addEventListener('keydown', this._onKeydown);
  }

  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.popup) return;
    const popupClass = this._popup.constructor as typeof ESLBasePopup;
    this.popup.removeEventListener(`${popupClass.eventNs}:statechange`, this._onPopupStateChange);
    this.removeEventListener('keydown', this._onKeydown);
  }

  protected attachEventListener(eventName: string | null, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }

  @bind
  protected _onShowEvent(e: Event) {
    (e.type === 'click' && this.popup.closeOnBodyClick) && e.stopPropagation();
    this.popup.show({
      trigger: this,
      delay: this.showDelayValue
    });
  }
  @bind
  protected _onHideEvent(e: Event) {
    (e.type === 'click' && this.popup.closeOnBodyClick) && e.stopPropagation();
    this.popup.hide({
      trigger: this,
      delay: this.hideDelayValue,
      trackHover: this.event === 'hover' && this.mode === 'toggle'
    });
  }
  @bind
  protected _onToggleEvent(e: Event) {
    return (this.active ? this._onHideEvent : this._onShowEvent)(e);
  }

  @bind
  protected _onPopupStateChange() {
    this.active = this.popup.open;
    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSUtil.toggleClsTo(clsTarget, this.activeClass, this.active);
    this.updateA11y();
    this.$$fireNs('statechange', {
      bubbles: true
    });
  }

  protected get showDelayValue(): number | undefined {
    const showDelay = DeviceDetector.isTouchDevice ? this.touchShowDelay : this.showDelay;
    return !showDelay || isNaN(+showDelay) ? undefined : +showDelay;
  }

  protected get hideDelayValue(): number | undefined {
    const hideDelay = DeviceDetector.isTouchDevice ? this.touchHideDelay : this.hideDelay;
    return !hideDelay || isNaN(+hideDelay) ? undefined : +hideDelay;
  }

  @bind
  protected _onKeydown(e: KeyboardEvent) {
    switch (e.which || e.keyCode) {
      case ENTER:
      case SPACE:
        this.click();
        e.preventDefault();
        break;
    }
  }

  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    target.setAttribute('aria-expanded', String(this.active));

    // TODO: auto generate
    if (this.popup.id) {
      target.setAttribute('aria-controls', this.popup.id);
    }
  }

  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }
}

export default ESLTrigger;
