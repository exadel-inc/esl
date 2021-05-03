import {ExportNs} from '../../esl-utils/environment/export-ns';
import {attr, boolAttr, ESLBaseElement} from '../../esl-base-element/core';
import {bind} from '../../esl-utils/decorators/bind';
import {ready} from '../../esl-utils/decorators/ready';
import {TraversingQuery} from '../../esl-traversing-query/core';
import {NoopFnSignature} from '../../esl-utils/misc/functions';
import {DeviceDetector} from '../../esl-utils/environment/device-detector';
import {CSSClassUtils} from '../../esl-utils/dom/class';
import {ENTER, SPACE} from '../../esl-utils/dom/keys';

import type {ESLToggleable} from '../../esl-toggleable/core/esl-toggleable';

@ExportNs('Trigger')
export class ESLTrigger extends ESLBaseElement {
  public static is = 'esl-trigger';

  static get observedAttributes() {
    return ['target', 'event', 'mode'];
  }
  /** @readonly Observed Toggleable active state marker */
  @boolAttr({readonly: true}) public active: boolean;

  /** CSS classes to set on active state */
  @attr({defaultValue: ''}) public activeClass: string;
  /** Target element {@link TraversingQuery} selector to set `activeClass` */
  @attr({defaultValue: ''}) public activeClassTarget: string;

  /** Selector for ignore inner elements */
  @attr({defaultValue: 'a[href]'}) public ignore: string;

  /** Target Toggleable {@link TraversingQuery} selector. `next` by default */
  @attr({defaultValue: 'next'}) public target: string;
  /** Event to handle by trigger. Support `click`, `hover` modes or any custom. `click` by default */
  @attr({defaultValue: 'click'}) public event: string;
  /** Action to pass to the Toggleable. Supports `show`, `hide` and `toggle` values. `toggle` by default */
  @attr({defaultValue: 'toggle'}) public mode: string;

  /** Selector of inner target element to place aria attributes. Uses trigger itself if blank */
  @attr({defaultValue: ''}) public a11yTarget: string;

  /** Show delay value */
  @attr() public showDelay: string;
  /** Hide delay value */
  @attr() public hideDelay: string;
  /** Touch device show delay value */
  @attr() public touchShowDelay: string;
  /** Touch device hide delay value */
  @attr() public touchHideDelay: string;

  protected _$target: ESLToggleable;
  protected __unsubscribers: NoopFnSignature[];

  protected attributeChangedCallback(attrName: string) {
    if (!this.connected) return;
    switch (attrName) {
      case 'target':
        this.updateTargetFromSelector();
        break;
      case 'mode':
      case 'event':
        this.unbindEvents();
        this.bindEvents();
        break;
    }
  }

  /** ESLTrigger 'primary' show event */
  protected get _showEvent() {
    if (this.mode === 'hide') return null;
    if (this.event === 'hover') {
      if (DeviceDetector.isTouchDevice) return 'click';
      return 'mouseenter';
    }
    return this.event;
  }
  /** ESLTrigger 'primary' hide event */
  protected get _hideEvent() {
    if (this.mode === 'show') return null;
    if (this.event === 'hover') {
      if (DeviceDetector.isTouchDevice) return 'click';
      return this.mode === 'hide' ? 'mouseenter' : 'mouseleave';
    }
    return this.event;
  }

  /** Target observable Toggleable */
  public get $target() {
    return this._$target;
  }
  public set $target(newPopupInstance) {
    this.unbindEvents();
    this._$target = newPopupInstance;
    if (this._$target) {
      this.bindEvents();
      this._onTargetStateChange();
    }
  }

  /** Element target to setup aria attributes */
  public get $a11yTarget(): HTMLElement | null {
    return this.a11yTarget ? this.querySelector(this.a11yTarget) : this;
  }

  @ready
  protected connectedCallback() {
    super.connectedCallback();
    this.updateTargetFromSelector();
  }
  @ready
  protected disconnectedCallback() {
    this.unbindEvents();
  }

  protected bindEvents() {
    if (!this.$target) return;
    if (this._showEvent === this._hideEvent) {
      this.attachEventListener(this._showEvent, this._onToggleEvent);
    } else {
      this.attachEventListener(this._showEvent, this._onShowEvent);
      this.attachEventListener(this._hideEvent, this._onHideEvent);
    }

    this.$target.addEventListener('esl:show', this._onTargetStateChange);
    this.$target.addEventListener('esl:hide', this._onTargetStateChange);

    this.addEventListener('keydown', this._onKeydown);
  }
  protected unbindEvents() {
    (this.__unsubscribers || []).forEach((off) => off());
    if (!this.$target) return;

    this.$target.removeEventListener('esl:show', this._onTargetStateChange);
    this.$target.removeEventListener('esl:hide', this._onTargetStateChange);

    this.removeEventListener('keydown', this._onKeydown);
  }

  protected attachEventListener(eventName: string | null, callback: (e: Event) => void) {
    if (!eventName) return;
    this.addEventListener(eventName, callback);
    this.__unsubscribers = this.__unsubscribers || [];
    this.__unsubscribers.push(() => this.removeEventListener(eventName, callback));
  }

  /** Update `$target` Toggleable  from `target` selector */
  protected updateTargetFromSelector() {
    if (!this.target) return;
    this.$target = TraversingQuery.first(this.target, this) as ESLToggleable;
  }

  /** True if event should be ignored */
  protected _isIgnored(target: EventTarget | null) {
    if (!target || !(target instanceof HTMLElement) || !this.ignore) return false;
    const $ignore = target.closest(this.ignore);
    // Ignore only inner elements (but do not ignore the trigger itself)
    return !!$ignore && $ignore !== this && this.contains($ignore);
  }

  /** Handles trigger open type of event */
  @bind
  protected _onShowEvent(event: Event) {
    if (this._isIgnored(event.target)) return;
    this.$target.show({
      activator: this,
      delay: this.showDelayValue,
      event
    });
    event.preventDefault();
  }

  /** Handles trigger hide type of event */
  @bind
  protected _onHideEvent(event: Event) {
    if (this._isIgnored(event.target)) return;
    this.$target.hide({
      activator: this,
      delay: this.hideDelayValue,
      trackHover: this.event === 'hover' && this.mode === 'toggle',
      event
    });
    event.preventDefault();
  }

  /** Handles trigger toggle type of event */
  @bind
  protected _onToggleEvent(e: Event) {
    return (this.active ? this._onHideEvent : this._onShowEvent)(e);
  }

  /** Handles ESLTogglable state change */
  @bind
  protected _onTargetStateChange() {
    this.toggleAttribute('active', this.$target.open);

    const clsTarget = TraversingQuery.first(this.activeClassTarget, this) as HTMLElement;
    clsTarget && CSSClassUtils.toggle(clsTarget, this.activeClass, this.active);

    this.updateA11y();

    this.$$fire('change:active');
  }

  /** Handles `keydown` event */
  @bind
  protected _onKeydown(event: KeyboardEvent) {
    if ([ENTER, SPACE].includes(event.key)) {
      switch (this.mode) {
        case 'show': return this._onShowEvent(event);
        case 'hide': return this._onHideEvent(event);
        default: return this._onToggleEvent(event);
      }
    }
  }

  /** Update aria attributes */
  public updateA11y() {
    const target = this.$a11yTarget;
    if (!target) return;

    target.setAttribute('aria-expanded', String(this.active));
    if (this.$target.id) {
      target.setAttribute('aria-controls', this.$target.id);
    }
  }

  /** Show delay attribute processing */
  public get showDelayValue(): number | undefined {
    const showDelay = DeviceDetector.isTouchDevice ? this.touchShowDelay : this.showDelay;
    return !showDelay || isNaN(+showDelay) ? undefined : +showDelay;
  }
  /** Hide delay attribute processing */
  public get hideDelayValue(): number | undefined {
    const hideDelay = DeviceDetector.isTouchDevice ? this.touchHideDelay : this.hideDelay;
    return !hideDelay || isNaN(+hideDelay) ? undefined : +hideDelay;
  }
}
