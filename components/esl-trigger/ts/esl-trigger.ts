import {ESLBaseElement, attr} from '../../esl-base-element/esl-base-element';
import {ESLPopup} from '../../esl-popup/esl-popup';
import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {findTarget} from '../../esl-utils/dom/traversing';
import {DeviceDetector} from '../../esl-utils/enviroment/device-detector';
import type {NoopFnSignature} from '../../esl-utils/misc/functions';
import {CSSUtil} from '../../esl-utils/dom/styles';
import {ENTER, SPACE} from '../../esl-utils/dom/keycodes';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static is = 'esl-trigger';
  public static eventNs = 'esl:trigger';

  static get observedAttributes() {
    return ['target', 'event', 'mode', 'active'];
  }

  // Markers
  @attr({conditional: true}) public active: boolean;

  // Main setting
  @attr({defaultValue: 'next'}) public target: string;
  @attr({defaultValue: 'click'}) public event: string;
  @attr({defaultValue: 'toggle'}) public mode: string;
  @attr({defaultValue: ''}) public a11yTarget: string;
  @attr({defaultValue: ''}) public activeClass: string;

  // Common properties
  @attr({}) public showDelay: string;
  @attr({}) public hideDelay: string;
  @attr({}) public touchShowDelay: string;
  @attr({}) public touchHideDelay: string;

  protected _popup: ESLPopup;
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
      this.onPopupStateChanged();
    }
  }

  protected updatePopupFromTarget() {
    if (!this.target) return;
    this.popup = findTarget(this.target, this) as ESLPopup;
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
    const popupClass = this._popup.constructor as typeof ESLPopup;
    this.popup.addEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);

    this.addEventListener('keydown', this.onKeydown);
  }

  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.popup) return;
    const popupClass = this._popup.constructor as typeof ESLPopup;
    this.popup.removeEventListener(`${popupClass.eventNs}:statechange`, this.onPopupStateChanged);
    this.removeEventListener('keydown', this.onKeydown);
  }

  protected attachEventListener(eventName: string | null, callback: (e: Event) => void) {
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
    CSSUtil.toggleClsTo(this, this.activeClass, this.active);
    this.updateA11y();
    this.$$fireNs('statechange', {
      bubbles: true
    });
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

  protected onKeydown = (e: KeyboardEvent) => {
    switch (e.which || e.keyCode) {
      case ENTER:
      case SPACE:
        this.click();
        e.preventDefault();
        break;
    }
  };

  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;
    target.setAttribute('aria-expanded',  String(this.active));

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
