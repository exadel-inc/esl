import {ExportNs} from '../../esl-utils/enviroment/export-ns';
import {ESLBaseElement, attr} from '../../esl-base-element/esl-base-element';
import {DeviceDetector} from '../../esl-utils/enviroment/device-detector';
import {ESLPopup} from '../../esl-popup/esl-popup';
import {findTarget} from '../../esl-utils/dom/traversing';
import type {NoopFnSignature} from '../../esl-utils/misc/functions';
import ESLTriggersContainer from "./esl-triggers-container";
import {ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ENTER, SPACE, TAB} from "../../esl-utils/dom/keycodes";

type GroupTarget = 'next' | 'previous' | 'active';

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
  @attr({}) protected showDelay: string;
  @attr({}) protected hideDelay: string;
  @attr({}) protected touchShowDelay: string;
  @attr({}) protected touchHideDelay: string;

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

  public get a11yRole() {
    if (this.hasAttribute('a11y-role')) {
      return this.getAttribute('a11y-role');
    }
    const container = this.container;
    return container ? container.a11yRole : 'button';
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

  public get container() {
    return this.closest(ESLTriggersContainer.is) as ESLTriggersContainer;
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
    this.activeClass && this.classList.toggle(this.activeClass, this.active);
    this.updateA11y();
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
      case ARROW_UP:
      case ARROW_LEFT:
        this.moveInGroup('previous', this.a11yRole === 'tab');
        e.preventDefault();
        break;
      case ARROW_DOWN:
      case ARROW_RIGHT:
        this.moveInGroup('next', this.a11yRole === 'tab');
        e.preventDefault();
        break;
    }
  };

  public moveInGroup(target: GroupTarget, activate = false) {
    const container = this.container;
    if (!container) return false;
    const targetEl =  container[target](this);
    if (!targetEl) return false;
    targetEl.focus();
    activate && targetEl.click();
  }

  protected updateA11y() {
    const target = this.$a11yTarget;
    switch (this.a11yRole) {
      case 'tab':
        target.setAttribute('aria-selected', this.active ? 'true' : 'false');
        target.setAttribute('tabindex', this.active ? '0' : '-1');
        break;
      default:
        target.setAttribute('aria-expanded', this.active ? 'true' : 'false');
        break;
    }

    // TODO: auto generate
    if (this.popup.id) {
      this.setAttribute('aria-controls', this.popup.id);
    }
  }

  protected get $a11yTarget() {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }
}

export default ESLTrigger;
